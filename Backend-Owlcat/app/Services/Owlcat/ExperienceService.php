<?php

namespace App\Services\Owlcat;

use App\Models\Level;
use App\Models\Owlcat;

class ExperienceService
{
    /**
     * Add experience and calculate level.
     *
     * @return array{level_up: bool, old_level: Level, new_level: Level, experience_gained: int}
     */
    public function addExperience(Owlcat $owlcat, int $experienceGained): array
    {
        $oldLevel = $owlcat->level;
        $newTotalExperience = $owlcat->experience + $experienceGained;

        // Find the highest level where required_experience <= newTotalExperience
        $newLevel = Level::where('required_experience', '<=', $newTotalExperience)
            ->orderByDesc('required_experience')
            ->first();

        if (! $newLevel) {
            $newLevel = $oldLevel;
        }

        $levelUp = $newLevel->number > $oldLevel->number;

        $owlcat->experience = $newTotalExperience;
        $owlcat->level_id = $newLevel->id;
        $owlcat->save();
        $owlcat->setRelation('level', $newLevel);

        return [
            'level_up' => $levelUp,
            'old_level' => $oldLevel,
            'new_level' => $newLevel,
            'experience_gained' => $experienceGained,
        ];
    }
}
