<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\InteractionRequest;
use App\Http\Resources\InteractionResultResource;
use App\Models\Owlcat;
use App\Services\Owlcat\InteractionService;
use Illuminate\Support\Facades\Gate;

class InteractionController extends Controller
{
    public function __construct(
        protected InteractionService $interactionService
    ) {}

    public function interact(InteractionRequest $request, Owlcat $owlcat): InteractionResultResource
    {
        Gate::authorize('interact', $owlcat);

        $result = $this->interactionService->execute(
            $owlcat,
            $request->user(),
            $request->validated('type'),
            $request->validated('message')
        );

        return new InteractionResultResource($result);
    }
}
