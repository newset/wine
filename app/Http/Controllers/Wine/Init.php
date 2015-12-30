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
	function index()
	{
		$this->user = Openid::where('openid', $this->openid)->first();
		$user = $this->user;
		return view('welcome')->with(compact('user'));
	}

	/**
	 * 当前用户
	 * @return [type] [description]
	 */
	function getMe()
	{
		$user = Openid::with('user')->where('openid', $this->openid)->first();

		$left = 2;
		if($user->user->last && $this->isToday($user->user->last)){
			$left = 2 - $user->user->times;
		}

		return [
			'user' => $user,
			'left' => $left
		];
	}

	/**
	 * 获取 openid 信息
	 * @return [type] [description]
	 */
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

	/**
	 * 结果提交
	 * @return [type] [description]
	 */
	public function postPlay()
	{
		$user = User::where('openid', $this->openid)->first();

		if($user->last && $this->isToday($user->last) && $user->times == 2){
			return [
				'left' => 0,
				'user' => $user,
				'save' => false
			];
		}

		if (Input::get('score') > $user->score || !$user->created_at) {
			$user->created_at = date('Y-m-d h:i:s', time());
		}
		
		$left = 0;
		if (!$user->last || ($user->last && !$this->isToday($user->last)) ) {
			$left = 1;
			$user->times = 1;
		}

		if ($user->last && $this->isToday($user->last) && $user->times == 1) {
			$left = 0;
			$user->times = 2;
		}

		$user->last = date('Y-m-d', time());

		$user->score = Input::get('score');
		$user->save();
		return [
			'left' => $left,
			'user' => $user
		];
	}

	/**
	 * 排名
	 * @return [type] [description]
	 */
	public function getTop()
	{
		$users = User::orderBy('score', 'desc')->with('openid')->take(10)->get();

		return $users;
	}

	protected function isToday($date)
	{
		$dt = new Carbon($date);
		return $dt->isToday();
	}
}
