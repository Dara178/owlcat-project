<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OwlcatState extends Model
{
    use HasFactory;

    protected $fillable = [
        'owlcat_id',
        'happiness',
        'energy',
        'curiosity',
        'boredom',
        'bond',
        'last_interacted_at',
    ];

    protected function casts(): array
    {
        return [
            'happiness' => 'integer',
            'energy' => 'integer',
            'curiosity' => 'integer',
            'boredom' => 'integer',
            'bond' => 'integer',
            'last_interacted_at' => 'datetime',
        ];
    }

    public function owlcat(): BelongsTo
    {
        return $this->belongsTo(Owlcat::class);
    }
}
