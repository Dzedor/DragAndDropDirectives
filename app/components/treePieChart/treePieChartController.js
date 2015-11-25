angular.module('App.treePieChart', []).controller('treePieChartController',
  function($scope, $http) {
    $http.get('app/components/treePieChart/statistics.json').then(function(response) {
      $scope.items = response.data;
    });
  });
