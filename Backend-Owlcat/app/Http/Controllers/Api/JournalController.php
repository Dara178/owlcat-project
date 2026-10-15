<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\JournalEntryResource;
use App\Models\Owlcat;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

class JournalController extends Controller
{
    public function index(Request $request, Owlcat $owlcat): AnonymousResourceCollection
    {
        Gate::authorize('viewJournal', $owlcat);

        $entries = $owlcat->journalEntries()->paginate(15);

        return JournalEntryResource::collection($entries);
    }
}
