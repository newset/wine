<!doctype html>
<html ng-app="wine">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1">
        <meta http-equiv="pragma" content="no-cache">
        <meta http-equiv="Cache-Control" content="no-cache, must-revalidate">
        <meta http-equiv="expires" content="-1">
        <title>酒窖真英雄</title>
        <link rel="stylesheet" href="lib/normalize-css/normalize.css">
        <link rel="stylesheet" href="lib/ng-dialog/css/ngDialog.min.css">
        <link rel="stylesheet" href="lib/ng-dialog/css/ngDialog-theme-default.min.css">
        <link rel="stylesheet" href="css/ngDialog-theme-flat.css">
        <link rel="stylesheet" href="css/style.css?_=111">
        <script>
        var phoneWidth = parseInt(window.screen.width);
        var phoneScale = phoneWidth/640;
        var ua = navigator.userAgent;
        if (/Android (\d+\.\d+)/.test(ua)){
            var version = parseFloat(RegExp.$1);
            if(version>2.3){
                document.write('<meta name="viewport" content="width=640, minimum-scale = '+phoneScale+', maximum-scale = '+phoneScale+', target-densitydpi=device-dpi">');
            }else{
                document.write('<meta name="viewport" content="width=640, target-densitydpi=device-dpi">');
            }
        } else {
            document.write('<meta name="viewport" content="width=640, user-scalable=no, target-densitydpi=device-dpi">');
        }

    </script>
        <script type="text/javascript">
            window.userinfo = '{{ $user ? 'ok' : ''}}';
            window.baseUrl = '{{url('/')}}'
        </script>
    </head>
    <body>
        <div class="grid">
            <div ui-view class="wrapper">
                
            </div>
        </div>
        <script src="lib/jquery/dist/jquery.min.js"></script>
        <script src="lib/underscore/underscore-min.js"></script>
        <script type="text/javascript" src="lib/angular/angular.min.js"></script>
        <script type="text/javascript" src="lib/angular-ui-router/release/angular-ui-router.min.js"></script>
        <script src="lib/ng-dialog/js/ngDialog.min.js"></script>
        <script src="js/app.js"></script>
        <script type="text/javascript">
            function isWechat() {
                return navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger';
            }

            function getParameterByName(name) {
                name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                    results = regex.exec(location.search);
                return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
            }
            if (getParameterByName('openid')) {
                localStorage.openid = getParameterByName('openid');
            }

            if (!localStorage.openid && isWechat() && userinfo != 'ok') {
                location.href= location.origin + '/wechat/auth';
            }
        </script>
        <script type="text/ng-template" id="templates/home.html">
            <div class="home" ng-click="game($event)">

            </div>
        </script>
        <script type="text/ng-template" id="templates/game.html">
            <div class="game">
                <div id="gamecontainer">
                    <img src="img/board.png" alt="" class="board">
                    <div class="blocks">
                        <div class="block" ng-repeat="block in game.matrix track by $index" ng-click="choose($index)">
                            <img ng-src="@{{res.url + block + res.extension}}" alt="">
                        </div>
                    </div>
                    <div class="numbers" ng-show="game.status && game.status == 'started'">
                        <div class="time" data-time="90">
                            @{{game.time}}
                            <span>s</span>
                        </div>
                        <div class="score" data-score="0" ng-bind="game.score">
                            
                        </div>
                    </div>
                    <div class="action btns" ng-hide="game.status && game.status == 'started'">
                        <input type="button" value="开始" class="start btn" ng-click="start()">
                    </div>
                    <div style="text-align: center; margin-top: 25px;position: fixed; left: 49%;bottom: 0;z-index:999;margin-left: -135px;">
                        <a ui-sref="rank" style="display: block;">
                            <img src="img/win-btn.png" alt="" style="">
                        </a>
                    </div>
                </div>
                
            </div>
        </script>
        <script type="text/ng-template" id="templates/rules.html">
            <div id="rules" ng-click="game()">
                <img src="img/rules.jpg" alt="">
                <div class="btns" style="display:none;">
                    <a ui-sref="game" title="">
                        <img src="img/btns/start.png" alt="">
                    </a>
                    <a ui-sref="rank" title="">
                        <img src="img/btns/rank.png" alt="">
                    </a>
                </div>
            </div>
        </script>
        <script type="text/ng-template" id="templates/rank.html">
            <div class="rank" id="rank">
                <img src="img/rank-header.png" alt="">
               <ol class="users custom">
                    <li ng-repeat="user in users" class="user">
                        <div class="thumb">
                               <img ng-src="@{{user.openid.headimgurl}}" alt="">
                        </div> 
                        <div class="texts">
                            <span class="name">
                            @{{user.openid.nickname}}
                            </span>
                            <span class="time">@{{user.openid.created_at | limitTo: 10}}</span>
                        </div>
                        
                        <span ng-bind="user.score" class="score-text"></span>
                    </li>
                </ol>
                <img src="img/rank-footer.png" alt="">

                <div class="btns">
                    <a href="" title="" ng-click="show()"><img src="img/btns/myscore.png" alt=""></a>
                    <a href="#rules" title=""><img src="img/btns/see-rules.png" alt=""></a>
                </div>
            </div>
        </script>
        <script type="text/ng-template" id="templates/modals/result.html">
            <div class="score modal">
                <div class="modal-container">
                    <img src="img/result.png" alt="" class="modal-bg">

                    <span class="digit">@{{ngDialogData.score}}</span>
                    <img src="img/this-score-text.png" alt="" class="score-primary-text">
                    <div class="score-secondary-box">
                        <img src="img/highest-score.png" alt="" class="score-secondary-text">
                        <span>@{{me.user.score}}</span>
                    </div>
                    <div class="btns">
                        <button type="button" class="play btn" ng-click="closeThisDialog('play')">再玩一次</button>
                        <button type="button" class="rank btn" ng-click="go('rank')">查看排名</button>
                    </div>
                    <span>剩余机会 @{{leftTimes}}</span>
                    <span class="close" ng-click="closeThisDialog()">x</span>
                </div>
            </div>
        </script>
        <script type="text/ng-template" id="templates/modals/info.html">
            <div class="register modal" ng-controller="Register">
                <div class="modal-container">
                    <img src="img/modal-bg.png" alt="" class="modal-bg">
                    <div class="modal-content">
                        <form method="get" accept-charset="utf-8">
                            <input type="text" ng-model="user.mobile" value="" placeholder="电话">
                            <input type="text" ng-model="user.name" value="" placeholder="姓名">
                        </form>

                        <p class="info">留下您的信息，以便中奖后联系你</p>
                    </div>
                    <div class="btns">
                        <button type="button" class="register-btn btn" ng-click="save()">注册</button>
                    </div>
                    <span class="close" ng-click="closeThisDialog()">x</span>
                </div>
            </div>
        </script>
        <script type="text/ng-template" id="templates/modals/no-left.html">
            <div class="score modal">
                <div class="modal-container">
                    <img src="img/no-left.png" alt="" class="modal-bg">
                    <div class="btns">
                        <button type="button" class="share btn" ng-click="showShare()">分享到朋友圈</button>
                        <button type="button" class="rank btn" ng-click="closeThisDialog('play');$state.go('rank')">查看排名</button>
                    </div>
                    <span class="close" ng-click="closeThisDialog()">x</span>
                </div>
            </div>
        </script>
        <script type="text/ng-template" id="templates/modals/score.html">
            <div class="score modal" ng-controller="Score">
                <div class="modal-container">
                    <span class="digit">@{{score}}</span>
                    <img src="img/result.png" alt="" class="modal-bg">
                    <img src="img/my-score.png" alt="" class="score-primary-text">
                    <div class="btns">
                        <button type="button" class="share btn" ng-click="showShare()">分享到朋友圈</button>
                        <button type="button" class="rank btn" ng-click="closeThisDialog('play')">查看排名</button>
                    </div>
                    <span class="close" ng-click="closeThisDialog()">x</span>
                </div>
            </div>
        </script>
        <script type="text/ng-template" id="templates/modals/share.html">
            <img src="img/share.png" alt="" style="width:100%" ng-click="closeThisDialog()">
        </script>
    </body>
</html>