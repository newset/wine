(function(window, $){

	/**
	 * 游戏模块
	 */
	function game(name, res){
		var _name = name,
			_timer = null,
			_instance = [],
			_res = res;

		var doms = {
			container: '#'+name+'gamecontainer',
			blockClass: 'block'
		}

		this.init = function(){
			this.matrix = [0, 0, 0, 0, 0, 0, 0, 0, 0];
			this.score = 0;
			this.time = _res.timeLimit;
			_.each(this.matrix, function(block, index){
				var show = _.random(0, _res.blocks.length-1);
				this.matrix[index] = _res.blocks[show];
			}.bind(this));

			this.status = undefined;
			this.matrix[_.random(0, 8)] = _res.defaut;
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

		}

		this.finish = function(target) {
			
		}

		this.choose = function(index){
			var correct = this.matrix[index] == _res.defaut;
			if (correct) {

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
angular.module('wine', ['ui.router'])
	.run(['$rootScope', function ($rootScope) {
		
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
				templateUrl: 'templates/rank.html'
			})
			.state('rules', {
				url: '/rules',
				templateUrl: 'templates/rules.html'
			})
	}])
	.controller('Game', function($scope, $interval){
		$scope.res = {
			url: 'img/blocks/',
			blocks: ['001', '002', '003', '004', '005', '006'],
			defaut: 'default',
			extension: '.png',
			point: 2,
			timeLimit: 3
		};

		$scope.game = new game('wine', $scope.res);
		$scope.game.init();

		$scope.start = function(){
			$scope.game.start();

			// timer
			var timer = $interval(function(){
				if($scope.game.time > 0) 
					return $scope.game.time -- 

				// 显示结果
			}, 1000)
		}

		$scope.choose = function(index){
			$scope.game.choose(index);
		}
	})
	