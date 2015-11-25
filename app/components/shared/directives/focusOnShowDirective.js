angular.module('App.SharedDirectives').directive('focusOnShow', function($timeout) {
    return {
        restrict: 'A',
        link: function($scope, $element, $attr) {

            var element = $element;

            while (!element.attr('ng-show') && !element.attr('ng-hide')) {
                element = element.parent();
            }

            var ngShowAttribute = element.attr('ng-show');
            var ngHideAttribute = element.attr('ng-hide');

            if (ngShowAttribute) {
                $scope.$watch(ngShowAttribute, function(newValue) {
                    if (newValue) {
                        $timeout(function() {
                            $element.focus();
                        }, 0);
                    }
                })
            } else if (ngHideAttribute) {
                $scope.$watch(ngShowAttribute, function(newValue) {
                    if (!newValue) {
                        $timeout(function() {
                            $element.focus();
                        }, 0);
                    }
                })
            }
        }
    };
});