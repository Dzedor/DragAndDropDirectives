(function() {
  'use strict'
  angular.module('App.Views', []);
  angular.module('App.SharedDirectives', []);

  angular.module('appversetraining', [
    'ui.router',
    'ui.bootstrap',
    'App.Views',
    'App.SharedDirectives',
    'App.DNDSortDirectiveModule',
    'App.itemsService',
    'App.sortedTable',
    'App.treePieChart',
    'App.countryInput'
  ]);
})();