<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OwlcatSkill extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'owlcat_skills';

    protected $fillable = [
        'owlcat_id',
        'skill_id',
        'unlocked_at',
    ];

    protected function casts(): array
    {
        return [
            'unlocked_at' => 'datetime',
        ];
    }

    public function owlcat(): BelongsTo
    {
        return $this->belongsTo(Owlcat::class);
    }

    public function skill(): BelongsTo
    {
        return $this->belongsTo(Skill::class);
    }
}
