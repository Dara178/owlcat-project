<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EvolutionStageResource;
use App\Models\EvolutionStage;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class EvolutionStageController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $stages = EvolutionStage::with('levels')->get();

        return EvolutionStageResource::collection($stages);
    }
}
