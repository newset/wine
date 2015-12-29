<?php
/**
 * Date: 10/22 0022
 * Time: 10:55
 * @author GROOT (pzyme@outlook.com)
 */

namespace App\Models\Wechat;
use Illuminate\Database\Eloquent\Model;
use DB;
use App\Models\User;

class Openid extends Model {
    protected $table = 'openid';

    public static function openid_exists($openid) {
        $query = DB::table('openid')->where('openid',$openid);

        return $query->exists();
    }

    public static function _update($openid,$data) {
        $query = DB::table('openid')->where('openid',$openid);
        return $query->update($data) > 0;
    }

    public static function one($openid) {
        $query = DB::table('openid')->where('openid',$openid);
        return $query->first();
    }

    public function user()
    {
        return $this->belongsTo('App\Models\User', 'openid', 'openid');
    }
}