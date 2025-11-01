<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Goals extends Model
{
    //
    protected $table = 'goals';

  protected $fillable = [
    'user_id',
    'name',
    'amount',
    'duration',
    'return_rate',
    'actual_value',
    'expected_value',
    'status',
    'goal_type',
];

     public $timestamps = true; 
}
