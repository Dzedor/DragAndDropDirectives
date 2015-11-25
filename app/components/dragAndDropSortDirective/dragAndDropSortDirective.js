angular.module('App.DNDSortDirectiveModule', [])
    .directive('dragAndDropSortItem', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                attr.$set("draggable", "true");

                element[0].addEventListener('dragstart', dragStart);
                element[0].addEventListener('dragend', dragEnd);

                function dragStart(e) {
                    e.stopPropagation();
                    e.dataTransfer.setData("text/plain", angular.toJson(scope.$eval(attr.dragAndDropSortItem)));
                    element.addClass("dragged");
                }

                function dragEnd(e) {
                    e.stopPropagation();
                    element.removeClass("dragged");
                }
            }
        }
    })
    .directive('dragAndDropSort', function ($parse, $timeout) {
        return {
            restrict: 'A',
            scope: {
                sortedArray: '=dragAndDropSort'
            },
            link: function (scope, element) {
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
                        angular.element(tbody).append(insertionPointer);
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
            }
        }
    });
