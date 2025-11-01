<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\GoalController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');


// Route::post('/goals', [GoalController::class, 'goalpost']);


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/goals', [GoalController::class, 'goalpost']);

    Route::get('/goals/lumpsum/{id}', [GoalController::class, 'showlumpsumgoaldetail']);

    Route::get('/goals/sip/{id}', [GoalController::class, 'showsipgoaldetail']);



Route::post('/goals/{id}/pdf', [GoalController::class, 'downloadPdf']);

Route::post('/goals/sip/pdf/{id}', [GoalController::class, 'generateSipPdf']);




Route::get('/user/profile', function (Request $request) {
    return $request->user();
});

Route::put('/user/profile/update/{id}', [GoalController::class, 'update']);

// Route::post('/calculate-sip', [GoalController::class, 'calculateSIP']);
Route::post('/goals/sip', [GoalController::class, 'calculateSIP']);

// Route::get('/goals/sip/{id}', [GoalController::class, 'getSipGoaldetail']);


Route::delete('/delete/goals/{id}', [GoalController::class, 'deleteGoal']);

    Route::get('/goalsdata', [GoalController::class, 'goalsdata']);

    Route::get('/goalsdata/lumpsum', [GoalController::class, 'goalsdatalumpsum']);

    Route::get('/goalsdata/sip', [GoalController::class, 'goalsdatasip']);


    Route::put('/updategoal/{id}', [GoalController::class, 'updategoal']);

});

