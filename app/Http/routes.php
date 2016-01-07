<?php

// if ( env('APP_ENV') != 'local' ) {
    URL::forceRootUrl('http://d.bloo.com/');
// }
// dd(URL::full());
/*
|--------------------------------------------------------------------------
| Routes File
|--------------------------------------------------------------------------
|
| Here is where you will register all of the routes in an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', 'Wine\\Init@index');
Route::controller('/api', 'Wine\\Init');

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| This route group applies the "web" middleware group to every route
| it contains. The "web" middleware group is defined in your HTTP
| kernel and includes session state, CSRF protection, and more.
|
*/

Route::get('/rank', function (Request $req) {
	$limit = $req->get('limit') ? $req->get('limit') : 0;
    $builder = DB::table('users')->orderBy('score', 'desc');

    if ($limit) {
    	return $builder->take($limit);
    }else{
    	return $builder->get();
    }
});

Route::get('init', 'Wine\\Init@index');

//微信网页授权
Route::get("wechat/auth", ['as'=>'wx_auth', 'uses' => "Wechat\\Auth@index"]);
Route::get("wechat/redirect", ['as'=>'wx_redirect', 'uses' => "Wechat\\Redirect@index"]);
