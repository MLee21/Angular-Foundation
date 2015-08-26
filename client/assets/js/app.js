(function() {
  'use strict';

  angular.module('application', [
    'ui.router',
    'ngAnimate',

    //foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations'
  ])
  .controller('FilmsCtrl', [
    "$scope",
    "$state",
    "$http",
    function($scope, $state, $http) {
      $scope.id = ($state.params.id || '');
      $scope.page = ($state.paramsp || 1);
      if ($scope.page == 1) {
        if ($scope.id != '') {
          $http.get("http://swapi.co/api/"+'films'+"/"+$scope.id,
            { cache: true })
          .success(function(data) {
            $scope['film'] = data;
          })
        } else {
          $http.get("http://swapi.co/api/"+'films'+"/", { cache: true })
          .success(function(data) {
            $scope['films'] = data;
            if (data['next']) $scope.nextPage = 2;
          });
        }
      } else {
        $http.get("http://swapi.co/api/"+'films'+"/?page="+$scope.page,
          { cache: true }).success(function(data) {
            $scope['films'] = data;
            if (data['next']) $scope.nextPage = 1*$scope.page + 1;
          });
          $scope.prevPage = 1*$scope.page - 1;
      }
      return $scope;
    }])
  .filter('capitalize', function() {
    return function (input) {
      return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g,
        function(text) {return text.charAt(0).toUpperCase() +
          text.substr(1)}) : '';
    }
  })
  .filter('lastdir', function (){
    return function (input) {
      return (!!input) ? input.split('/').slice(-2, -1)[0] : '';
    }
  })
    .config(config)
    .run(run)
  ;

  config.$inject = ['$urlRouterProvider', '$locationProvider'];

  function config($urlProvider, $locationProvider) {
    $urlProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled:false,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');
  }

  function run() {
    FastClick.attach(document.body);
  }

})();
