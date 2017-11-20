foundITApp.controller('userAppListCtrl', function ($scope, userService, toaster, $timeout, _) {
    $scope.init = function () {
        console.log('usererAppListCtrl init');
        $scope.data = {
            myFavList: [],
            order: 'Choose Order...',
            orders: ['Name', 'Listeners']
        };
        $scope.refresh();
    };

    $scope.getMyFavList = function () {
        userService.checkMyFavList().then(function success (myFavList) {
            console.log('myFavList', myFavList);
            $scope.data.myFavList = myFavList;
        }, function error (err) {
            console.log('my app list error', err);
        })
    };

    $scope.refresh = function () {
        var initialData = {
            myFavList: [],
            order: 'Choose Order...',
            orders: ['Name', 'Listeners']
        };
        $scope.data = angular.copy(initialData);
        $scope.getMyFavList();
    };

    $scope.orederByName = function () {
        console.log('sort by name');
        $scope.data.order = $scope.data.orders[0];
        $scope.data.myFavList = _.sortBy($scope.data.myFavList, function (artist) {
            return artist.name;
        });
    };

    $scope.orderByListeners = function () {
        console.log('sort by listeners');
        $scope.data.order = $scope.data.orders[1];
        $scope.data.myFavList = _.sortBy($scope.data.myFavList, function (artist) {
            return artist.followers;
        });
        $scope.data.myFavList.reverse();
    };


    $scope.init();
});
