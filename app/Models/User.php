<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Wechat\Openid;

class User extends Model
{
	protected $guarded = ['id'];

	public $timestamps = false;

}
