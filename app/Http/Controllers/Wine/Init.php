<?php 
	namespace App\Http\Controllers\Wine;

use Carbon\Carbon;
use App\Http\Controllers\Wechat\Controller;
use Requests, App\Models\User;
use Cache, Input;
use App\Models\Wechat\Openid;

/**
* 		
*/
class Init extends Controller
{
	function __construct() {
		parent::__construct();
	}

	function index()
	{
		$user = Openid::where('openid', $this->openid)->first();
		return view('welcome')->with(compact('user'));
	}

	function getMe()
	{
		$user = Openid::with('user')->where('openid', $this->openid)->first();

		return $user;
	}

	public function postInfo()
	{
		$user = User::firstOrNew(['openid' => $this->openid]);
		$data = Input::only('mobile', 'name');
		$user->mobile = $data['mobile'];
		$user->name = $data['name'];
		$user->openid = $this->openid;
		$user->save();
		return $user;
	}
}
