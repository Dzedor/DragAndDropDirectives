angular.module('App.Views').config(function($stateProvider, $urlRouterProvider, $locationProvider) {

  $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise("/sortedTable");

  $stateProvider.state('sortedTable', {
    url: "/sortedTable",
    templateUrl: "app/components/sortedTable/sortedTableView.html",
    controller: "sortedTableController"
  }).state('sortedTableTransfer', {
    url: "/sortedTableTransfer",
    templateUrl: "app/components/sortedTableTransfer/sortedTableTransferView.html",
    controller: "sortedTableTransferController"
  }).state('sortedTableTransferMultiple', {
    url: "/sortedTableTransferMultiple",
    templateUrl: "app/components/sortedTableTransferMultiple/sortedTableTransferMultipleView.html",
    controller: "sortedTableTransferMultipleController"
  }).state('treePieChart', {
    url: "/treePieChart",
    templateUrl: "app/components/treePieChart/treePieChartView.html",
    controller: "treePieChartController"
  });
});
