<?php

namespace App\Services\Owlcat;

use App\Models\Owlcat;
use App\Models\Skill;
use Illuminate\Support\Collection;

class SkillUnlockService
{
    /**
     * Evaluate and unlock eligible skills for an Owlcat.
     *
     * @return Collection<int, Skill> Newly unlocked skills
     */
    public function checkAndUnlock(Owlcat $owlcat): Collection
    {
        $currentLevelNumber = $owlcat->level->number;
        $currentStageId = $owlcat->evolution_stage_id;

        // Get currently unlocked skill IDs
        $existingSkillIds = $owlcat->skills()->pluck('skills.id')->toArray();

        // Find candidate skills that meet criteria
        $eligibleSkills = Skill::where(function ($query) use ($currentLevelNumber) {
            $query->whereNull('required_level')
                ->orWhere('required_level', '<=', $currentLevelNumber);
        })
            ->where(function ($query) use ($currentStageId) {
                $query->whereNull('required_stage_id')
                    ->orWhere('required_stage_id', '<=', $currentStageId);
            })
            ->whereNotIn('id', $existingSkillIds)
            ->get();

        $unlockedNow = collect();

        foreach ($eligibleSkills as $skill) {
            $owlcat->skills()->attach($skill->id, [
                'unlocked_at' => now(),
            ]);
            $unlockedNow->push($skill);
        }

        return $unlockedNow;
    }
}
