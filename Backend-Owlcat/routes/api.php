<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EvolutionStageController;
use App\Http\Controllers\Api\InteractionController;
use App\Http\Controllers\Api\JournalController;
use App\Http\Controllers\Api\OwlcatController;
use App\Http\Controllers\Api\SkillController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

/*
|--------------------------------------------------------------------------
| Protected Routes (Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    // Session & User
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/user', [AuthController::class, 'me']);

    // Owlcat Adoption & Status
    Route::post('/owlcats', [OwlcatController::class, 'adopt']);
    Route::get('/owlcats/{owlcat}', [OwlcatController::class, 'show']);

    // Interactions
    Route::post('/owlcats/{owlcat}/interactions', [InteractionController::class, 'interact']);

    // Journal & Skills
    Route::get('/owlcats/{owlcat}/journal', [JournalController::class, 'index']);
    Route::get('/owlcats/{owlcat}/skills', [SkillController::class, 'index']);

    // Evolution Stages
    Route::get('/evolution-stages', [EvolutionStageController::class, 'index']);
});
