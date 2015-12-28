<?php
/**
 * Date: 8/13 0013
 * Time: 15:01
 * @author GROOT (pzyme@outlook.com)
 */

namespace App\Http\Controllers\Wechat;

use App\Http\Controllers\Wechat\Controller;
use Input;
use Requests;
use Cache;
use App\Models\Wechat\Openid;

class Redirect extends Controller {

    public function index() {
        $code = Input::get("code");
        $state = Input::get("state");
        $goto = Cache::get('wechat:state:'.$state);

        $url = $this->getTokenURI($code);
        $res = Requests::get($url);
        $response = json_decode($res->body, true);
        Cache::put('wechat:auth:access_token',$response['access_token'],intval($response['expires_in']) / 60 - 1);

        if($response['scope'] == 'snsapi_userinfo') {
            $userinfo = $this->getUserInfo($response['access_token'],$response['openid']);
            $userinfo['privilege'] = json_encode($userinfo['privilege']);
            if(Openid::openid_exists($response['openid'])) {
                Openid::_update($response['openid'],$userinfo);
            } else {
                $openid = new Openid();
                $openid->setRawAttributes($userinfo);
                $openid->save();
            }
        }

        return redirect()->away($goto.'?openid='.$response['openid'])->withCookie(cookie('_openid',$response['openid']));
    }
}