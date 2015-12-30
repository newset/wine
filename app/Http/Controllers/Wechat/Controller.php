<?php
/**
 * Date: 8/13 0013
 * Time: 15:06
 * @author GROOT (pzyme@outlook.com)
 */

namespace App\Http\Controllers\Wechat;

use Illuminate\Routing\Controller as BaseController;
use Request;
use Requests, Session;
use Input;

class Controller extends BaseController {

    private $app_id;
    private $app_secret;
    protected $openid;

    private $auth_url = 'https://open.weixin.qq.com/connect/oauth2/authorize';
    private $token_url = 'https://api.weixin.qq.com/sns/oauth2/access_token';
    private $user_url = 'https://api.weixin.qq.com/sns/userinfo';

    public function __construct() {
        $this->app_id = env('WEIXIN_APP_ID');
        $this->app_secret = env('WEIXIN_APP_SECRET');
        $this->openid = Input::cookie('_openid', null);
        session(['wechat_openid' => $this->openid]);
    }

    public function getAppId() {
        return $this->app_id;
    }

    public function getAppSecret() {
        return $this->app_secret;
    }


    public function getAuthURI($redirect, $scope, $state) {
        $param = [
            'appid' => $this->app_id,
            'redirect_uri' => $redirect,
            'response_type' => 'code',
            'scope' => $scope,
            'state' => $state
        ];
        return $this->auth_url.'?'.http_build_query($param).'#wechat_redirect';
    }

    public function getTokenURI($code) {
        $param = [
            'appid' => $this->app_id,
            'secret' => $this->app_secret,
            'code' => $code,
            'grant_type' => 'authorization_code'
        ];

        return $this->token_url.'?'.http_build_query($param);
    }

    public function getUserInfo($access_token, $openid) {
        $param = [
            'access_token' => $access_token,
            'openid' => $openid,
            'lang' => 'zh_CN'
        ];
        $url = $this->user_url.'?'.http_build_query($param);
        $res = Requests::get($url);
        //todo 错误处理
        //{"errcode":40003,"errmsg":" invalid openid "}

        return json_decode($res->body,true);
    }
}