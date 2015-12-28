<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$app->get('/', function () use ($app) {
    return $app->welcome();
});

$app->get('/rank', function () {
    return 'Hello World';
});

$app->post('/user', function () {

	
    return 'Hello World';
});

//微信网页授权
Route::get("wechat/auth", ['as'=>'wx_auth', 'uses' => "Wechat\\Auth@index"]);
Route::get("wechat/redirect", ['as'=>'wx_redirect', 'uses' => "Wechat\\Redirect@index"]);
