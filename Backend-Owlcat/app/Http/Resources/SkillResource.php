<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SkillResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'description' => $this->description,
            'required_level' => $this->required_level,
            'required_stage_id' => $this->required_stage_id,
            'required_stage_name' => $this->requiredStage?->name,
            'unlocked_at' => $this->pivot?->unlocked_at ? \Illuminate\Support\Carbon::parse($this->pivot->unlocked_at)->toISOString() : ($this->unlocked_at instanceof \DateTimeInterface ? $this->unlocked_at->toISOString() : $this->unlocked_at),
        ];
    }
}
