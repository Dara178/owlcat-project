<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SkillResource;
use App\Models\Owlcat;
use App\Models\Skill;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class SkillController extends Controller
{
    public function index(Request $request, Owlcat $owlcat): JsonResponse
    {
        Gate::authorize('viewSkills', $owlcat);

        $unlockedSkills = $owlcat->skills()->with('requiredStage')->get();
        $unlockedIds = $unlockedSkills->pluck('id')->toArray();

        $lockedSkills = Skill::whereNotIn('id', $unlockedIds)
            ->with('requiredStage')
            ->orderBy('required_level')
            ->get();

        return response()->json([
            'data' => [
                'unlocked' => SkillResource::collection($unlockedSkills),
                'locked' => SkillResource::collection($lockedSkills),
            ],
        ]);
    }
}
