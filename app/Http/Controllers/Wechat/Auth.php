<?php
/**
 * Date: 8/13 0013
 * Time: 15:01
 * @author GROOT (pzyme@outlook.com)
 */

namespace App\Http\Controllers\Wechat;

use App\Http\Controllers\Wechat\Controller;
use Carbon\Carbon;
use Input;
use Cache;

class Auth extends Controller {

    public function index() {
        $scope = Input::get('scope', 'snsapi_userinfo');
        $goto = Input::get('goto', 'http://www.blooplus.com/wine');
        $state = Carbon::now()->format("YmdHi").mt_rand(1000,9999);
        Cache::put('wechat:state:'.$state, $goto, 5);

        $url = $this->getAuthURI('http://www.blooplus.com/wine/wechat/redirect', $scope, $state);

        return redirect()->away($url);
    }
}