angular.module('App.sortedTable', []);    
angular.module('App.sortedTable').controller('sortedTableController',
        function ($scope, itemsService) {
            $scope.items = itemsService.getItems();
            $scope.inEdit = false;
            $scope.inAdd = false;
            $scope.itemInEdit = {};

            $scope.editItem = function (item) {
                $scope.itemInEdit = angular.copy(item);
                $scope.inEdit = true;
            };

            $scope.submitItemEdit = function () {
                if ($scope.inEdit) {
                    itemsService.saveChanges($scope.itemInEdit);
                } else if ($scope.inAdd) {
                    itemsService.addItem($scope.itemInEdit);
                }

                $scope.inEdit = $scope.inAdd = false;
            };

            $scope.cancelItemEdit = function () {
                $scope.inEdit = $scope.inAdd = false;
            };

            $scope.removeItem = function (item) {
                itemsService.removeItem(item);
            };

            $scope.addItem = function () {
                $scope.itemInEdit = {
                    name: ''
                };
                $scope.inAdd = true;
            };
        });