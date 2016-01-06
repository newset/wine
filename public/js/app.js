(function(window, $){

	/**
	 * 游戏模块
	 */
	function game(name, res){
		var _name = name,
			_timer = null,
			_instance = [],
			_res = res, 
			_level = 0,
			starter = [0, 0, 0, 0, 0, 0, 0, 0, 0];

		this.init = function(){
			_level = 0 ;
			this.score = 0;
			this.time = _res.timeLimit;
			this.status = undefined;

			this.matrix = this.generate();
		}

		this.start = function(timer, target){
			this.status = 'started';
			// start timer
			
		}

		this.pause = function(timer, target) {
			this.status = 'pause';
			// stop timer
		}


		this.generate = function() {
			var c = _res.levels[_level],
				l = c * c,
				m = _.range(0, l),
				blocks = _.sample(_.range(0, 20), l<=20 ? l : 20 );

			_.each(m, function(block, index){
				var len = _res.blocks.length;
				m[index] = _res.blocks[blocks[index%(len-1)]];
			}.bind(this));
			m[_.random(0, l-1)] = _res.defaut+8;
			
			console.log('length: ', c, m, l);
			return m;
		}

		this.levelGrid = function(){
			return _res.levels[_level];
		} 

		this.nextLevel = function() {
			if (_level < _res.levels.length-1) {
				_level ++;
			};
			console.log('level: ', _level);
			return this.levelGrid();
		}

		this.choose = function(index, callback){
			var match = this.matrix[index].match(_res.defaut), 
				correct = match && match.length;

			if (!correct && this.time > 0 && this.status == 'started') {
				this.time - _res.error > 0 ? this.time = this.time - _res.error : this.time = 0;
 			}

 			var reload = false;
			if (correct && this.time > 0 && this.status == 'started') {				
				this.score+=_res.point;
				reload = true
			}

			return [correct, reload];
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

		$rootScope.showShare =  function(){
			ngDialog.open({
				template: 'templates/modals/share.html',
				className: 'ngdialog-theme-flat ngdialog-theme-custom',
				showClose: false
			})
		}

		$rootScope.show = function(template, data, controller){
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
	}])
	.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/intro');

		$stateProvider
			.state('intro', {
				url: '/intro',
				templateUrl: 'templates/intro.html',
				controller: 'Intro'
			})
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
	.controller('Intro', ['$scope', 'ngDialog', '$rootScope', '$http', '$state', function ($scope, ngDialog, $rootScope, $http, $state) {
		$scope.start = function(){
			if ($rootScope.leftTimes<=0) {
				$rootScope.show('templates/modals/no-left.html');
				return;
			};

			// 更新当前状态 根据微信
			if (!$rootScope.me.user) {
				var register = $rootScope.show('templates/modals/info.html', {}, 'Register');
				register.closePromise.then(function(data){
					if (data.value) {
						$state.go('home');
					};
				})
			}else{
				$state.go('home', {});
			};
		}
	}])
	.controller('Game', function($scope, $interval, ngDialog, $rootScope, $http, $rootScope, $timeout){
		$scope.res = {
			url: 'img/blocks/',
			blocks: ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010', '011', '012', '013', '014', '015', '016', '017', '018', '019', '020', '021'],
			defaut: 'right/right-',
			defautLenght: 1,
			extension: '.png',
			point: 10,
			levels: [3, 4, 5, 6], 
			error: 5,
			timeLimit: 30
		};

		$scope.initGame = function(){
			$scope.game = new game('wine', $scope.res);
			$scope.game.init();
		}

		$scope.initGame();

		$scope.startTimer = function(){
			// timer
			var timer = $interval(function(){
				if($scope.game.time > 0) 
					return $scope.game.time -- 

				$interval.cancel(timer);
				// 显示结果
				var url = baseUrl + '/api/play',
					score = $scope.game.score;
				if ($rootScope.me.user && $rootScope.me.user.score > $scope.game.score) {
					score = $rootScope.me.user.score;
				};
				$http.post(url, {
					score : score
				}).success(function(res){
					$rootScope.me.user = res.user;
					$rootScope.leftTimes = res.left;

					var dialog = $rootScope.show('templates/modals/result.html', 
						{score: $scope.game.score}
					);

					dialog.closePromise.then(function(data){
						$scope.initGame();
						if (data.value == 'play') {
							//再玩一次
							$scope.start();
						}else{
							// 跳转到其他地方
							
						}
					});
				})
				
			}, 1000);
		}

		$scope.start = function(){
			if ($rootScope.leftTimes<=0) {
				$rootScope.show('templates/modals/no-left.html');
				return;
			};

			$scope.game.start();
			$scope.startTimer();
		}

		$scope.start();

		$scope.choose = function(index){
			var res = $scope.game.choose(index);

			if (res[0] && res[1]) {
				$scope.rightChoose = index;
				$timeout(function(){
					$scope.rightChoose = -1;
					$scope.level = $scope.game.nextLevel();
					$scope.game.matrix = $scope.game.generate();
				}, 100);
			};
		}
	})
	.controller('Score', ['$scope', '$rootScope', function ($scope, $rootScope) {
		$scope.score = $rootScope.me.user.score || 0;
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
	