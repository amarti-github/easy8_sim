<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Source extends Model
{
    public $primaryKey = 'entry_id';
    protected $guarded = [''];
    public $timestamps = false;
}
