<?php

namespace App\Services\Owlcat;

use App\Models\OwlcatState;

class EmotionService
{
    /**
     * Calculate deterministic emotion based on PRD-02 Section 9.
     */
    public function calculate(OwlcatState $state, ?string $lastAction = null): string
    {
        if ($state->energy <= 20) {
            return 'sleepy';
        }

        if ($state->happiness <= 25) {
            return 'sad';
        }

        if ($state->boredom >= 75) {
            return 'bored';
        }

        if ($state->bond >= 75 && in_array($lastAction, ['pet', 'care'], true)) {
            return 'affectionate';
        }

        if ($state->curiosity >= 70) {
            return 'curious';
        }

        if ($state->happiness >= 50) {
            return 'happy';
        }

        return 'neutral';
    }
}
