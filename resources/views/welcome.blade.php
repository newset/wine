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
        <link rel="stylesheet" href="lib/ng-dialog/css/ngDialog.css">
        <link rel="stylesheet" href="lib/ng-dialog/css/ngDialog-theme-default.css">
        <link rel="stylesheet" href="css/ngDialog-theme-flat.css">
        <link rel="stylesheet" href="css/style.css">
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
        <script src="lib/jquery/dist/jquery.js"></script>
        <script src="lib/underscore/underscore.js"></script>
        <script type="text/javascript" src="lib/angular/angular.js"></script>
        <script type="text/javascript" src="lib/angular-ui-router/release/angular-ui-router.js"></script>
        <script src="lib/ng-dialog/js/ngDialog.js"></script>
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
    </body>
</html>