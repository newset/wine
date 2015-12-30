(function(window, $){

	/**
	 * 游戏模块
	 */
	function game(name, res){
		var _name = name,
			_timer = null,
			_instance = [],
			_res = res, 
			starter = [0, 0, 0, 0, 0, 0, 0, 0, 0];

		var doms = {
			container: '#'+name+'gamecontainer',
			blockClass: 'block'
		}

		this.init = function(){
			this.score = 0;
			this.time = _res.timeLimit;
			this.status = undefined;

			this.matrix = this.generate(starter);
		}

		this.start = function(timer, target){
			this.status = 'started';

			// start timer
		}

		this.pause = function(timer, target) {
			this.status = 'pause';

			// stop timer
		}

		this.reload = function(target) {
			
		}

		this.reloadMetrix = function(metrix){

		}

		this.generate = function(metrix) {
			var m = metrix,
				blocks = _.sample(_.range(0, 20), m.length);

			_.each(m, function(block, index){
				m[index] = _res.blocks[blocks[index]];
			}.bind(this));

			m[_.random(0, m.length-1)] = _res.defaut+_.sample(_.range(1, _res.defautLenght));
			return m;
		}

		this.finish = function(target) {
			
		}

		this.choose = function(index){
			var match = this.matrix[index].match(_res.defaut), 
				correct = match && match.length;
			if (correct && this.time > 0 && this.status == 'started') {
				this.score+=_res.point;

				this.matrix = this.generate(starter);
			};
			return correct;
		}

		return this;
	}

	/**
	 * 控制模块
	 */

	window.game = game;

})(window, jQuery);

/**
* wine Module
*
* Description
*/
angular.module('wine', ['ui.router', 'ngDialog'])
	.run(['$rootScope', '$state', 'ngDialog', '$http', function ($rootScope, $state, ngDialog, $http) {
		$rootScope.go = function(state){
			$state.go(state);
			ngDialog.closeAll();
		}

		$rootScope.$state = $state;

		var meUrl = baseUrl + '/api/me';
		$http.get(meUrl).success(function(res){
			$rootScope.me = res.user;
			$rootScope.leftTimes = res.left;
		});
	}])
	.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('home', {
				url: '/',
				templateUrl: 'templates/game.html',
				controller: 'Game'
			})
			.state('rank', {
				url: '/rank',
				templateUrl: 'templates/rank.html',
				controller: 'Rank'
			})
			.state('rules', {
				url: '/rules',
				templateUrl: 'templates/rules.html'
			})
	}])
	.controller('Game', function($scope, $interval, ngDialog, $rootScope, $http, $rootScope){
		$scope.res = {
			url: 'img/blocks/',
			blocks: ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010', '011', '012', '013', '014', '015', '016', '017', '018', '019', '020', '021'],
			defaut: 'right/right-',
			defautLenght: 10,
			extension: '.png',
			point: 10,
			timeLimit: 90
		};

		$scope.initGame = function(){
			$scope.game = new game('wine', $scope.res);
			$scope.game.init();
		}

		$scope.initGame();

		$scope.start = function(){
			if ($rootScope.leftTimes<=0) {
				$scope.show('templates/modals/no-left.html');
				return;
			};

			// 更新当前状态 根据微信
			if (!$rootScope.me.user) {
				var register = $scope.show('templates/modals/info.html', {}, 'Register');
				register.closePromise.then(function(data){
					$scope.game.start();
					$scope.startTimer();
				})
			}else{
				$scope.game.start();
				$scope.startTimer();
			};
		}

		$scope.startTimer = function(){
			// timer
			var timer = $interval(function(){
				if($scope.game.time > 0) 
					return $scope.game.time -- 

				$interval.cancel(timer);
				// 显示结果
				var url = baseUrl + '/api/play';
				$http.post(url, {
					score : $rootScope.me.user && $rootScope.me.user.score < $scope.game.score ? $scope.game.score : $rootScope.me.user.score
				}).success(function(res){
					$rootScope.me.user = res.user;
					$rootScope.leftTimes = res.left;

					var dialog = $scope.show('templates/modals/result.html', 
						{score: $scope.game.score}
					);

					dialog.closePromise.then(function(data){
						$scope.initGame();
						if (data.value == 'share') {
							//显示分享
							
						};
					});
				})
				
			}, 1000);
		}

		$scope.show = function(template, data, controller){
			var config = { 
				template: template,
				closeByDocument: false,
				className: 'ngdialog-theme-flat ngdialog-theme-custom',
				showClose: false, 
				data: data
			};
			if (controller) {
				config.controller = controller;
			};
			return ngDialog.open(config);
		}

		$scope.choose = function(index){
			$scope.game.choose(index);
		}
	})
	.controller('Score', ['$scope', '$rootScope', function ($scope, $rootScope) {
		$scope.score = $rootScope.me.user.score;
	}])
	.controller('Rank', ['$scope', 'ngDialog', '$state', '$http', function ($scope, ngDialog, $state, $http) {
		var url = baseUrl + '/api/top';
		$http.get(url).success(function(res){
			$scope.users = res;
		});

		$scope.show = function(data, controller){
			var config = { 
				template: 'templates/modals/score.html',
				closeByDocument: false,
				className: 'ngdialog-theme-flat ngdialog-theme-custom',
				showClose: false, 
				data: data
			};
			if (controller) {
				config.controller = controller;
			};
			ngDialog.open(config);
		}
	}])
	.controller('Register', ['$scope', '$http', function ($scope, $http) {
		$scope.save = function(){
			var url = baseUrl + '/api/info'
			$http.post(url, $scope.user).success(function(res){
				if (res) {
					$scope.closeThisDialog('');
				};
			});
		}
	}])
	