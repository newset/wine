<?php 
	namespace App\Http\Controllers\Wine;

use Carbon\Carbon;
use App\Http\Controllers\Wechat\Controller;
use Requests, App\Models\User;
use Cache;
use App\Models\Wechat\Openid;

/**
* 		
*/
class Init extends Controller
{
	function __construct() {
		parent::__construct();

		$this->openid = 'oVwG5uGB48zM1mkHh7l2es6OuOHo';
	}

	function index()
	{
		$user = User::where('openId', $this->openid)->first();
		if (!$user) {
			
		}

		$me = json_encode($user);

		return view('welcome')->with(compact('me', 'user'));
	}
}
