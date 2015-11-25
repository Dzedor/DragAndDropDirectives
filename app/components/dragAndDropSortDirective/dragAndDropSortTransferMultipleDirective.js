angular.module('App.DNDSortDirectiveModule')
    .directive('dragAndDropSortTransferMultipleItem', function () {
        return {
            restrict: 'A',
            require: '^dragAndDropSortTransferMultiple',
            link: function (scope, element, attr, controller) {
                attr.$set("draggable", "true");
                
                element[0].addEventListener('dragstart', dragStart);
                element[0].addEventListener('dragend', dragEnd);
                element[0].addEventListener('click', click);
                
                function dragStart(e) {
                    e.stopPropagation();
                    var draggedData = scope.$eval(attr.dragAndDropSortTransferMultipleItem);
                    if(!controller.isSelected(draggedData)) {
                        controller.clearSelection();
                        controller.addSelectedItem(draggedData);
                    }
                    controller.dragStart();
                    e.dataTransfer.setData("text/plain", angular.toJson(controller.getSelectedItems()));
                    element.addClass("dragged");
                }

                function dragEnd(e) {
                    e.stopPropagation();
                    controller.dragEnd(e.dataTransfer.dropEffect);
                    element.removeClass("dragged");
                }
                
                function click(e) {
                    var clickedItem = scope.$eval(attr.dragAndDropSortTransferMultipleItem);
                    if(e.ctrlKey) {
                        controller.toggleSelection(clickedItem);
                    } else {
                        controller.clearSelection();
                        controller.addSelectedItem(clickedItem);
                    }
                }
                
                scope.$watchCollection(function() {return controller.selectedItems}, function() {
                    controller.isSelected(scope.$eval(attr.dragAndDropSortTransferMultipleItem)) 
                        ? element.addClass("selected") : element.removeClass("selected");
                });
            }
        }
    })
    .directive('dragAndDropSortTransferMultiple', function ($parse, $timeout) {
        return {
            restrict: 'A',
            scope: {
                sortedArray: '=dragAndDropSortTransferMultiple'
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

                    moveItems(dataObject);

                    insertionPointer.remove();
                    isDragged = false;
                    return false;
                }
                
                function moveItems(items) {
                    var newIndex = Array.prototype.indexOf.call(tbody.children, insertionPointer);
                    scope.$apply(function () {
                        items.forEach(function(item) {
                            var oldIndex = scope.sortedArray.map(function (e) { return angular.toJson(e); }).indexOf(angular.toJson(item));
                            if(oldIndex > -1) {
                                scope.sortedArray.splice(oldIndex, 1);
                                if(newIndex > oldIndex) { newIndex--; }
                            }
                        });
                        
                        scope.sortedArray = scope.sortedArray.slice(0, newIndex).concat(items).concat(scope.sortedArray.slice(newIndex));
                    });
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
                this.dropped = false;

                this.elementDropped = function() {
                    this.clearSelection();
                    this.dropped = true;
                };
                
                this.dragStart = function() {
                    this.dropped = false;   
                };

                this.dragEnd = function(effect) {
                    if(effect === "move" && !this.dropped) {
                        this.getSelectedItems().forEach(function(item) {
                            var index = $scope.sortedArray.map(function (e) { return angular.toJson(e); }).indexOf(angular.toJson(item));
                            if(index > -1) {
                                $scope.sortedArray.splice(index, 1);
                            }
                        });
                        $scope.$apply();
                    }
                    this.clearSelection();
                };
                
                this.selectedItems = [];
                
                this.getSelectedItems = function() {
                    return this.selectedItems.filter(function(item) { return item !== null; });   
                };
                
                this.addSelectedItem = function(item) {
                    var index = $scope.sortedArray.indexOf(item);
                    this.selectedItems[index] = item;
                    $scope.$apply();
                };
                this.removeSelectedItem = function(item) {
                    this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
                    $scope.$apply();
                };
                this.isSelected = function(item) {
                    return this.selectedItems.indexOf(item) > -1;   
                };
                this.toggleSelection = function(item) {
                    if(this.isSelected(item)) {
                       this.removeSelectedItem(item);
                    } else {
                       this.addSelectedItem(item);
                    }
                };
                this.clearSelection = function() {
                    this.selectedItems = [];
                    $scope.$apply();
                };
            }
        }
    }
);
