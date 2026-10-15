<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JournalEntry extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'owlcat_id',
        'type',
        'title',
        'description',
        'emotion',
        'metadata',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'metadata' => 'array',
            'created_at' => 'datetime',
        ];
    }

    public function owlcat(): BelongsTo
    {
        return $this->belongsTo(Owlcat::class);
    }
}
