<?php

namespace App\Services\Owlcat;

use App\Models\EvolutionStage;
use App\Models\Owlcat;

class EvolutionService
{
    /**
     * Check and process evolution based on current level.
     *
     * @return array{evolved: bool, old_stage: EvolutionStage, new_stage: EvolutionStage}
     */
    public function checkEvolution(Owlcat $owlcat): array
    {
        $currentStage = $owlcat->evolutionStage;
        $targetStageId = $owlcat->level->evolution_stage_id;

        $evolved = $currentStage->id !== $targetStageId;

        if ($evolved) {
            $newStage = EvolutionStage::findOrFail($targetStageId);
            $owlcat->evolution_stage_id = $newStage->id;
            $owlcat->save();
            $owlcat->setRelation('evolutionStage', $newStage);

            return [
                'evolved' => true,
                'old_stage' => $currentStage,
                'new_stage' => $newStage,
            ];
        }

        return [
            'evolved' => false,
            'old_stage' => $currentStage,
            'new_stage' => $currentStage,
        ];
    }
}
