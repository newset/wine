<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Wechat\Openid;

class User extends Model
{
    public function openid()
    {
    	return $this->belongsTo(Openid::class, 'openid', 'openid');
    }
}
