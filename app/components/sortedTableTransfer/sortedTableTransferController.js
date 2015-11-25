angular.module('App.sortedTable').controller('sortedTableTransferController',
        function ($scope, itemsService) {
            $scope.items = itemsService.getItems();
            $scope.items2 = [];
        });