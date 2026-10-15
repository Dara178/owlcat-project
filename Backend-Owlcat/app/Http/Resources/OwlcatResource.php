<?php

namespace App\Http\Resources;

use App\Models\Level;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OwlcatResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $currentLevel = $this->level;
        $nextLevel = Level::where('number', '>', $currentLevel?->number ?? 1)
            ->orderBy('number')
            ->first();

        $nextLevelXp = $nextLevel?->required_experience ?? 1000;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'species' => $this->species,
            'emotion' => $this->current_emotion,
            'level' => [
                'number' => $currentLevel?->number ?? 1,
                'name' => $currentLevel?->name ?? 'Polluelo curioso',
                'experience' => $this->experience,
                'next_level_experience' => $nextLevelXp,
            ],
            'stage' => [
                'id' => $this->evolutionStage?->id ?? 1,
                'code' => $this->evolutionStage?->code ?? 'hatchling',
                'name' => $this->evolutionStage?->name ?? 'Polluelo',
                'description' => $this->evolutionStage?->description ?? '',
            ],
            'stats' => [
                'happiness' => $this->state?->happiness ?? 50,
                'energy' => $this->state?->energy ?? 50,
                'curiosity' => $this->state?->curiosity ?? 50,
                'boredom' => $this->state?->boredom ?? 50,
                'bond' => $this->state?->bond ?? 0,
            ],
            'skills' => SkillResource::collection($this->whenLoaded('skills')),
            'adopted_at' => $this->adopted_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
