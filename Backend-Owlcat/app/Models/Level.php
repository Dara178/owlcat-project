<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Level extends Model
{
    use HasFactory;

    protected $fillable = [
        'number',
        'name',
        'required_experience',
        'evolution_stage_id',
    ];

    public function evolutionStage(): BelongsTo
    {
        return $this->belongsTo(EvolutionStage::class);
    }

    public function owlcats(): HasMany
    {
        return $this->hasMany(Owlcat::class);
    }
}
