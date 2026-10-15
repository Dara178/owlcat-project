<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Skill extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'description',
        'required_level',
        'required_stage_id',
    ];

    public function requiredStage(): BelongsTo
    {
        return $this->belongsTo(EvolutionStage::class, 'required_stage_id');
    }

    public function owlcats(): BelongsToMany
    {
        return $this->belongsToMany(Owlcat::class, 'owlcat_skills')
            ->withPivot('unlocked_at');
    }
}
