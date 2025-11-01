<?php

namespace App\Http\Controllers\api;

use App\Models\User;
use App\Models\Goals;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class GoalController extends Controller
{
    //
public function goalpost(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'amount' => 'required|numeric',
        'duration' => 'required|integer', 
        'return_rate' => 'required|numeric', 
    ]);

    if (!Auth::check()) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    $years = $validated['duration'] / 12;

    $expectedValue = $validated['amount'] * pow(1 + ($validated['return_rate'] / 100), $years);

    $progressRatio = rand(30, 60) / 100; 
    $actualValue = $request->amount;

    $goal = Goals::create([
        'user_id' => Auth::id(),
        'name' => $validated['name'],
        'amount' => $validated['amount'],
        'duration' => $validated['duration'], // stored as months
        'return_rate' => $validated['return_rate'],
        'expected_value' => $expectedValue,
        'actual_value' => $actualValue, 
        'status' => 'active',
        'goal_type' => 'lumpsum',
    ]);

    return response()->json([
        'message' => 'Goal created successfully',
        'goal' => $goal
    ], 201);
}


  public function goalsdatalumpsum(){

    if(!Auth::check()){
        return response()->json(['error'=> 'Unautherized'],401);
    }
    $user = Auth::user();
    $goals = Goals::where('user_id',$user->id)->where('goal_type', 'lumpsum')->get();

    return response()->json([
        'goals' => $goals
    ],200);
  }

  public function goalsdata(){

    if(!Auth::check()){
        return response()->json(['error'=> 'Unautherized'],401);
    }
    $user = Auth::user();
    $goals = Goals::where('user_id',$user->id)->get();

    return response()->json([
        'goals' => $goals
    ],200);
  }
  

    public function goalsdatasip(){

    if(!Auth::check()){
        return response()->json(['error'=> 'Unautherized'],401);
    }
    $user = Auth::user();
    $goals = Goals::where('user_id',$user->id)->where('goal_type', 'sip')->get();

    return response()->json([
        'goals' => $goals
    ],200);
  }


public function updategoal(Request $request, $id)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'amount' => 'required|numeric',
        'duration' => 'required|integer', 
        'return_rate' => 'required|numeric',
        'actual_value' => 'nullable|numeric', 
    ]);

    $goal = Goals::findOrFail($id);

    $years = $validated['duration'] / 12;

    $expected_value = $validated['amount'] * pow(1 + ($validated['return_rate'] / 100), $years);

    $goal->update([
        'name' => $validated['name'],
        'amount' => $validated['amount'],
        'duration' => $validated['duration'], 
        'return_rate' => $validated['return_rate'],
        'expected_value' => $expected_value,
        'actual_value' => $validated['actual_value'] ?? $goal->actual_value,
        'goal_type' => 'lumpsum',
    ]);

    return response()->json([
        'message' => 'Goal updated successfully!',
        'goal' => $goal,
    ],200);
    
}

public function showlumpsumgoaldetail($id)
{
    $goal = Goals::where('user_id', Auth::id())->where('goal_type','lumpsum')->findOrFail($id);
    return response()->json($goal);
}



public function showsipgoaldetail($id)
{
    $goal = Goals::where('user_id', Auth::id())->findOrFail($id);
    return response()->json(['goal' => $goal]);
}



public function downloadPdf(Request $request, $id)
{
    $goal = Goals::findOrFail($id);
    $chartImage = $request->input('chartImage'); // base64 chart from frontend

    $pdf = PDF::loadView('pdf.goal', [
        'name' => $goal->name,
        'amount' => $goal->amount,
        'duration' => $goal->duration,
        'return_rate' => $goal->return_rate,
        'expected_value' => $goal->expected_value,
        'actual_value' => $goal->actual_value,
        'chartImage' => $chartImage,
    ]);

    return $pdf->download("{$goal->name}_report.pdf");
}


 public function generateSipPdf(Request $request, $id)
    {
        $validated = $request->validate([
            'chartImage' => 'required|string',
            'yearlyData' => 'required|array',
        ]);

        $goal = Goals::where('user_id', Auth::id())->find($id);
        if (!$goal) {
            return response()->json(['error' => 'Goal not found'], 404);
        }

        $pdf = Pdf::loadView('pdf.sipreport', [
            'goal' => $goal,
            'chartImage' => $validated['chartImage'],
            'yearlyData' => $validated['yearlyData'],
        ]);

        return $pdf->download($goal->name . '_report.pdf');
    }



public function profile(Request $request)
{
    return response()->json($request->user());
}

public function update(Request $request, $id)
{
    // Find the user by ID
    $user = User::findOrFail($id);

    // Validate the incoming data
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email',
        'phone_number' => 'nullable|string|max:20',
    ]);

    // Update the user
    $user->update($validated);

    return response()->json([
        'message' => 'Profile updated successfully',
        'user' => $user
    ]);
}


public function calculateSIP(Request $request)
{
    $validated = $request->validate([
        'monthly_investment' => 'required|numeric|min:1',
        'annual_return_rate' => 'required|numeric|min:1',
        'years' => 'required|integer|min:1',
        'name' => 'required|string|max:255', // add goal name for saving
    ]);

    $monthly_investment = $validated['monthly_investment'];
    $annual_return_rate = $validated['annual_return_rate'];
    $years = $validated['years'];

    $monthly_rate = $annual_return_rate / 12 / 100;
    $months = $years * 12;

    $future_value = $monthly_investment * ((pow(1 + $monthly_rate, $months) - 1) / $monthly_rate) * (1 + $monthly_rate);

    $total_investment = $monthly_investment * $months;
    $estimated_returns = $future_value - $total_investment;

    $goal = Goals::create([
        'user_id' => Auth::id(),
        'name' => $validated['name'],
        'amount' => $monthly_investment,
        'duration' => $years,
        'return_rate' => $annual_return_rate,
        'actual_value' => round($total_investment, 2),
        'expected_value' => round($future_value, 2),
        'status' => 'active',
        'goal_type' => 'sip',
    ]);

    return response()->json([
        'message' => 'SIP goal created successfully!',
        'goal' => $goal,
        'summary' => [
            'monthly_investment' => $monthly_investment,
            'annual_return_rate' => $annual_return_rate,
            'years' => $years,
            'total_investment' => round($total_investment, 2),
            'estimated_returns' => round($estimated_returns, 2),
            'future_value' => round($future_value, 2),
        ]
    ]);
}


public function deleteGoal($id)
{
    $goal = Goals::where('user_id', Auth::id())->find($id);

    if (!$goal) {
        return response()->json(['error' => 'Goal not found or unauthorized'], 404);
    }

    $goal->delete();

    return response()->json(['message' => 'Goal deleted successfully']);
}






}
