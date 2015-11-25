angular.module('App.sortedTable').controller('sortedTableTransferMultipleController',
        function ($scope, itemsService) {
            $scope.items = itemsService.getItems();
            $scope.items2 = [];
        });