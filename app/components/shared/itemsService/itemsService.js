angular.module('App.itemsService', []);

angular.module('App.itemsService').factory('itemsService',
    function (desserts) {
        var itemList = angular.copy(desserts);

        function getItems() {
            itemList = angular.copy(desserts);
            return itemList;
        }

        function removeItem(item) {
            var index = itemList.indexOf(item);
            if (index > -1) itemList.splice(index, 1);
        }

        function addItem(item) {
            var _item = {
                id: itemList.length + 1,
                name: item.name
            };

            itemList.push(_item);
        }

        function saveChanges(item) {
            for (var i = 0; i < itemList.length; i++) {
                if (itemList[i].id == item.id) {
                    itemList[i].name = item.name;
                }
            }
        }

        return {
            getItems: getItems,
            removeItem: removeItem,
            addItem: addItem,
            saveChanges: saveChanges
        }
    }
)
.value("desserts",
    [
        {
            id: 1,
            name: "Chocolate Pudding"
        },
        {
            id: 2,
            name: "Chocolate Tart"
        },
        {
            id: 3,
            name: "Chocolate Mousse"
        },
        {
            id: 4,
            name: "Chocolate Ice Cream"
        },
        {
            id: 5,
            name: "Chocolate Pie"
        },
        {
            id: 6,
            name: "Chocolate Fondue"
        },
        {
            id: 7,
            name: "Chocolate Cake"
        },
        {
            id: 8,
            name: "Chocolate Brownie"
        },
        {
            id: 9,
            name: "Chocolate Pancake"
        }
    ]);