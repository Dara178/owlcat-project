<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Owlcat extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'species',
        'level_id',
        'evolution_stage_id',
        'experience',
        'current_emotion',
        'adopted_at',
    ];

    protected function casts(): array
    {
        return [
            'experience' => 'integer',
            'adopted_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function state(): HasOne
    {
        return $this->hasOne(OwlcatState::class);
    }

    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class);
    }

    public function evolutionStage(): BelongsTo
    {
        return $this->belongsTo(EvolutionStage::class);
    }

    public function interactions(): HasMany
    {
        return $this->hasMany(Interaction::class);
    }

    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'owlcat_skills')
            ->withPivot('unlocked_at');
    }

    public function journalEntries(): HasMany
    {
        return $this->hasMany(JournalEntry::class)->latest('created_at');
    }
}
