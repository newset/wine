<?php
/**
 * Date: 10/22 0022
 * Time: 9:34
 * @author GROOT (pzyme@outlook.com)
 */

namespace App\Http\Controllers\Wechat;
use App\Http\Controllers\Wechat\Controller;
use Input,Cache;
use App\Models\Wechat\Openid;

class Enjoy extends Controller {

    public function getIndex() {
        $openid = Openid::one($this->openid);
        return view('wechat.enjoy.animation')->with('openid',$openid);
    }

    public function getAnimation() {
        $openid = Openid::one($this->openid);
        return view('wechat.enjoy.animation')->with('openid',$openid);
    }
}