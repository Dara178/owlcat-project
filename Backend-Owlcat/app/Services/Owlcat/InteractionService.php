<?php

namespace App\Services\Owlcat;

use App\Models\Interaction;
use App\Models\Owlcat;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class InteractionService
{
    /**
     * Interaction stat modifier matrix according to PRD-02 Section 10.
     */
    protected const MODIFIERS = [
        'pet' => [
            'happiness' => 8,
            'energy' => 0,
            'curiosity' => 0,
            'boredom' => -5,
            'bond' => 6,
            'xp' => 5,
        ],
        'play' => [
            'happiness' => 15,
            'energy' => -12,
            'curiosity' => 8,
            'boredom' => -20,
            'bond' => 5,
            'xp' => 15,
        ],
        'talk' => [
            'happiness' => 5,
            'energy' => -2,
            'curiosity' => 12,
            'boredom' => -8,
            'bond' => 8,
            'xp' => 10,
        ],
        'care' => [
            'happiness' => 8,
            'energy' => 15,
            'curiosity' => 0,
            'boredom' => -10,
            'bond' => 5,
            'xp' => 8,
        ],
    ];

    public function __construct(
        protected EmotionService $emotionService,
        protected ExperienceService $experienceService,
        protected EvolutionService $evolutionService,
        protected SkillUnlockService $skillUnlockService,
        protected JournalService $journalService
    ) {}

    /**
     * Execute interaction within transaction.
     */
    public function execute(Owlcat $owlcat, User $user, string $type, ?string $message = null): array
    {
        return DB::transaction(function () use ($owlcat, $user, $type, $message) {
            $modifiers = self::MODIFIERS[$type] ?? [
                'happiness' => 0,
                'energy' => 0,
                'curiosity' => 0,
                'boredom' => 0,
                'bond' => 0,
                'xp' => 0,
            ];

            // Lock and refresh state
            $state = $owlcat->state()->lockForUpdate()->firstOrFail();
            $emotionBefore = $owlcat->current_emotion;

            // Apply modifiers and clamp values between 0 and 100
            $state->happiness = $this->clamp($state->happiness + $modifiers['happiness']);
            $state->energy = $this->clamp($state->energy + $modifiers['energy']);
            $state->curiosity = $this->clamp($state->curiosity + $modifiers['curiosity']);
            $state->boredom = $this->clamp($state->boredom + $modifiers['boredom']);
            $state->bond = $this->clamp($state->bond + $modifiers['bond']);
            $state->last_interacted_at = now();
            $state->save();

            // Calculate new emotion
            $emotionAfter = $this->emotionService->calculate($state, $type);
            $owlcat->current_emotion = $emotionAfter;
            $owlcat->save();

            // Calculate XP and level
            $xpResult = $this->experienceService->addExperience($owlcat, $modifiers['xp']);

            // Calculate evolution
            $evoResult = $this->evolutionService->checkEvolution($owlcat);

            // Check skill unlocks
            $unlockedSkills = $this->skillUnlockService->checkAndUnlock($owlcat);

            // Interaction description response
            $responseMessage = $this->generateMessage($owlcat, $type, $message);

            // Record interaction
            $interaction = Interaction::create([
                'owlcat_id' => $owlcat->id,
                'user_id' => $user->id,
                'type' => $type,
                'message' => $message,
                'experience_gained' => $modifiers['xp'],
                'emotion_before' => $emotionBefore,
                'emotion_after' => $emotionAfter,
                'changes' => [
                    'modifiers' => $modifiers,
                    'stats' => [
                        'happiness' => $state->happiness,
                        'energy' => $state->energy,
                        'curiosity' => $state->curiosity,
                        'boredom' => $state->boredom,
                        'bond' => $state->bond,
                    ],
                ],
                'created_at' => now(),
            ]);

            // Events collection for response
            $events = [];

            // Record journal entry for Level Up if applicable
            if ($xpResult['level_up']) {
                $events[] = ['type' => 'level_up', 'level' => $xpResult['new_level']->number];
                $this->journalService->record(
                    $owlcat,
                    'level_up',
                    "¡Subió al Nivel {$xpResult['new_level']->number}!",
                    "{$owlcat->name} ha acumulado suficiente experiencia y alcanzó el nivel {$xpResult['new_level']->number} ({$xpResult['new_level']->name}).",
                    'happy',
                    ['level' => $xpResult['new_level']->number]
                );
            }

            // Record journal entry for Evolution if applicable
            if ($evoResult['evolved']) {
                $events[] = ['type' => 'evolved', 'stage' => $evoResult['new_stage']->code];
                $this->journalService->record(
                    $owlcat,
                    'evolution',
                    "¡Evolución a {$evoResult['new_stage']->name}!",
                    "Un resplandor místico envolvió a {$owlcat->name}. ¡Ha evolucionado a la etapa {$evoResult['new_stage']->name}!",
                    'curious',
                    ['stage' => $evoResult['new_stage']->code]
                );
            }

            // Record journal entries for newly unlocked skills
            foreach ($unlockedSkills as $skill) {
                $this->journalService->record(
                    $owlcat,
                    'skill_unlock',
                    "Nueva Habilidad: {$skill->name}",
                    "{$owlcat->name} aprendió \"{$skill->name}\": {$skill->description}",
                    'happy',
                    ['skill_code' => $skill->code]
                );
            }

            // If user included a custom message in "talk" or interaction
            if ($message) {
                $this->journalService->record(
                    $owlcat,
                    'interaction_talk',
                    'Conversación especial',
                    "Le dijiste: \"{$message}\". {$owlcat->name} escuchó atentamente y reaccionó con emoción {$emotionAfter}.",
                    $emotionAfter,
                    ['user_message' => $message]
                );
            }

            // Reload relationships for clean resource output
            $owlcat->load(['level', 'evolutionStage', 'state', 'skills']);

            return [
                'interaction' => $interaction,
                'owlcat' => $owlcat,
                'message' => $responseMessage,
                'events' => $events,
                'unlocked_skills' => $unlockedSkills,
                'level_up' => $xpResult['level_up'],
                'evolved' => $evoResult['evolved'],
            ];
        });
    }

    protected function clamp(int $val, int $min = 0, int $max = 100): int
    {
        return max($min, min($max, $val));
    }

    protected function generateMessage(Owlcat $owlcat, string $type, ?string $message = null): string
    {
        return match ($type) {
            'pet' => "Acariciaste suavemente a {$owlcat->name}. ¡Siente mucha calidez y ronronea plácidamente!",
            'play' => "¡{$owlcat->name} persiguió una pluma mágica y saltó alegremente por todos lados!",
            'talk' => $message
                ? "Le dijiste: \"{$message}\". {$owlcat->name} inclinó la cabeza con curiosidad y maulló en respuesta."
                : "Le hablaste con cariño a {$owlcat->name}. Te escuchó atentamente con sus ojos brillantes.",
            'care' => "Cuidaste a {$owlcat->name} con un reconfortante descanso y comida saludable. Recuperó energía.",
            default => "{$owlcat->name} interactuó contigo con curiosidad.",
        };
    }
}
