<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdoptOwlcatRequest;
use App\Http\Resources\OwlcatResource;
use App\Models\EvolutionStage;
use App\Models\Level;
use App\Models\Owlcat;
use App\Models\OwlcatState;
use App\Services\Owlcat\JournalService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class OwlcatController extends Controller
{
    public function __construct(
        protected JournalService $journalService
    ) {}

    public function adopt(AdoptOwlcatRequest $request): JsonResponse
    {
        $user = $request->user();

        // Enforce 1 pet per user for MVP
        if ($user->owlcat()->exists()) {
            throw new ConflictHttpException('Ya tienes un Owlcat adoptado.');
        }

        $level1 = Level::where('number', 1)->firstOrFail();
        $stage1 = EvolutionStage::where('code', 'hatchling')->firstOrFail();

        $owlcat = DB::transaction(function () use ($user, $request, $level1, $stage1) {
            $owlcat = Owlcat::create([
                'user_id' => $user->id,
                'name' => $request->validated('name'),
                'species' => 'owlcat',
                'level_id' => $level1->id,
                'evolution_stage_id' => $stage1->id,
                'experience' => 0,
                'current_emotion' => 'happy',
                'adopted_at' => now(),
            ]);

            OwlcatState::create([
                'owlcat_id' => $owlcat->id,
                'happiness' => 60,
                'energy' => 70,
                'curiosity' => 65,
                'boredom' => 30,
                'bond' => 15,
                'last_interacted_at' => now(),
            ]);

            $this->journalService->record(
                $owlcat,
                'adoption',
                '¡Bienvenido al mundo!',
                "Adoptaste a {$owlcat->name}. Empieza una hermosa aventura de amistad y evolución juntos.",
                'happy'
            );

            return $owlcat;
        });

        $owlcat->load(['level', 'evolutionStage', 'state', 'skills']);

        return (new OwlcatResource($owlcat))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Request $request, Owlcat $owlcat): OwlcatResource
    {
        Gate::authorize('view', $owlcat);

        $owlcat->load(['level', 'evolutionStage', 'state', 'skills']);

        return new OwlcatResource($owlcat);
    }
}
