<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Interaction extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'owlcat_id',
        'user_id',
        'type',
        'message',
        'experience_gained',
        'emotion_before',
        'emotion_after',
        'changes',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'experience_gained' => 'integer',
            'changes' => 'array',
            'created_at' => 'datetime',
        ];
    }

    public function owlcat(): BelongsTo
    {
        return $this->belongsTo(Owlcat::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
