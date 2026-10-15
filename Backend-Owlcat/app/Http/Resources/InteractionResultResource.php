<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InteractionResultResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'interaction' => [
                'id' => $this->resource['interaction']->id,
                'type' => $this->resource['interaction']->type,
                'experience_gained' => $this->resource['interaction']->experience_gained,
                'created_at' => $this->resource['interaction']->created_at?->toISOString(),
            ],
            'owlcat' => new OwlcatResource($this->resource['owlcat']),
            'message' => $this->resource['message'],
            'events' => $this->resource['events'],
            'unlocked_skills' => SkillResource::collection($this->resource['unlocked_skills']),
            'level_up' => $this->resource['level_up'] ?? false,
            'evolved' => $this->resource['evolved'] ?? false,
        ];
    }
}
