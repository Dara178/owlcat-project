<?php

namespace App\Services\Owlcat;

use App\Models\JournalEntry;
use App\Models\Owlcat;

class JournalService
{
    /**
     * Create a journal entry.
     */
    public function record(
        Owlcat $owlcat,
        string $type,
        string $title,
        string $description,
        ?string $emotion = null,
        ?array $metadata = null
    ): JournalEntry {
        return JournalEntry::create([
            'owlcat_id' => $owlcat->id,
            'type' => $type,
            'title' => $title,
            'description' => $description,
            'emotion' => $emotion ?? $owlcat->current_emotion,
            'metadata' => $metadata,
            'created_at' => now(),
        ]);
    }
}
