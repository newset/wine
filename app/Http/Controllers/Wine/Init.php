<?php 
	namespace App\Http\Controllers\Wine;

use Carbon\Carbon;
use App\Http\Controllers\Wechat\Controller;
use Requests, App\Models\User;
use Cache;

/**
* 		
*/
class Init extends Controller
{
	function index()
	{
		return [User::all(), $this->openid];
	}
}
