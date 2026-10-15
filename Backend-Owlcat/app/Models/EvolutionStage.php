<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EvolutionStage extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'description',
        'min_level',
        'max_level',
    ];

    public function levels(): HasMany
    {
        return $this->hasMany(Level::class);
    }

    public function owlcats(): HasMany
    {
        return $this->hasMany(Owlcat::class);
    }

    public function skills(): HasMany
    {
        return $this->hasMany(Skill::class, 'required_stage_id');
    }
}
