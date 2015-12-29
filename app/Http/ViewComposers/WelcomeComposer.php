<?php

namespace App\Http\ViewComposers;

use Illuminate\View\View;
use App\Models\Wechat\Openid;
use Input, Cache;
use Illuminate\Http\Request;

class WelcomeComposer
{
    /**
     * The user repository implementation.
     *
     * @var UserRepository
     */
    protected $user;
    protected $openid;

    /**
     * Create a new profile composer.
     *
     * @param  UserRepository  $users
     * @return void
     */
    public function __construct(Request $req)
    {
        // Dependencies automatically resolved by service container...

        $user = Openid::where('openid', session('wechat_openid'))->first();
        $this->user = $this->user ? ['login' => true] : false;
    }

    /**
     * Bind data to the view.
     *
     * @param  View  $view
     * @return void
     */
    public function compose(View $view)
    {
        $view->with('user', $this->user);
    }
}