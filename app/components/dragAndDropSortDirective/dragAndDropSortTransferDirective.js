angular.module('App.DNDSortDirectiveModule')
    .directive('dragAndDropSortTransferItem', function () {
        return {
            restrict: 'A',
            require: '^dragAndDropSortTransfer',
            link: function (scope, element, attr, controller) {
                attr.$set("draggable", "true");

                element[0].addEventListener('dragstart', dragStart);
                element[0].addEventListener('dragend', dragEnd);

                function dragStart(e) {
                    e.stopPropagation();
                    var draggedData = scope.$eval(attr.dragAndDropSortTransferItem);
                    e.dataTransfer.setData("text/plain", angular.toJson(draggedData));
                    controller.dragStart(draggedData);
                    element.addClass("dragged");
                }

                function dragEnd(e) {
                    e.stopPropagation();
                    controller.dragEnd(e.dataTransfer.dropEffect);
                    element.removeClass("dragged");
                }
            }
        }
    })
    .directive('dragAndDropSortTransfer', function ($parse, $timeout) {
        return {
            restrict: 'A',
            scope: {
                sortedArray: '=dragAndDropSortTransfer'
            },
            link: function (scope, element, attrs, controller) {
                var isDragged = false;

                var tbody = element[0].querySelector(':scope > tbody');
                var insertionPointer = angular.element("<tr class='insertionPointer'><td colspan='99'></td></tr>")[0];

                element[0].addEventListener('dragover', dragOver);
                element[0].addEventListener('drop', drop);
                element[0].addEventListener('dragleave', dragLeave);

                function dragOver(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    if (insertionPointer.parentNode != tbody) {
                        element.append(insertionPointer);
                    }

                    var trNode = e.target;
                    while (trNode.parentNode !== tbody && trNode.parentNode) {
                        trNode = trNode.parentNode;
                    }

                    if (trNode.parentNode === tbody && trNode !== insertionPointer) {
                        insertPointer(e, trNode);
                    }

                    isDragged = true;
                    return false;
                }

                function drop(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    controller.elementDropped();

                    var data = e.dataTransfer.getData("text/plain");
                    var dataObject = angular.fromJson(data);

                    var newIndex = Array.prototype.indexOf.call(tbody.children, insertionPointer);
                    var oldIndex = scope.sortedArray.map(function (e) { return angular.toJson(e); }).indexOf(data);

                    scope.$apply(function () {
                        if(oldIndex > -1) {
                            scope.sortedArray.splice(oldIndex, 1);
                            if(newIndex > oldIndex) newIndex--;
                        }
                        scope.sortedArray.splice(newIndex, 0, dataObject);
                    });

                    insertionPointer.remove();
                    isDragged = false;
                    return false;
                }

                function dragLeave(e) {
                    isDragged = false;
                    $timeout(function () {
                        if (!isDragged) {
                            insertionPointer.remove();
                        }
                    }, 50);
                }

                function insertPointer(e, node) {
                    if (e.offsetY < node.offsetHeight / 2) {
                        angular.element(node).before(insertionPointer);
                    } else {
                        angular.element(node).after(insertionPointer);
                    }
                }
            },
            controller: function($scope) {
                this.draggedData = {};
                this.dropped = false;

                this.dragStart = function(data) {
                    this.draggedData = data;
                    this.dropped = false;
                };

                this.elementDropped = function() {
                    this.dropped = true;
                };

                this.dragEnd = function(effect) {
                    if(effect === "move" && !this.dropped) {
                        var index = $scope.sortedArray.indexOf(this.draggedData);
                        if(index > -1 ) {
                            $scope.$apply( function() {
                                $scope.sortedArray.splice(index, 1);
                            });
                        }
                        this.dropped = false;
                        this.draggedData = {};
                    }
                };
            }
        }
    }
);
