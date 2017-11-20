foundITApp.controller('userSearchCtrl', function ($scope, userService, toaster, $location, $timeout) {
    $scope.init = function () {
        console.log('seeker search ctrl');
        $scope.data = {
            keyWord: '',
            keyWordCopy: '',
            jobList: [],
            searchResult: [],
            pristine: true,
            cv: '',
            page: 1,
            favlist: [],
            isLoading: false
        };
        $scope.masterCopy = angular.copy($scope.data);
    };

    // already added as favourite artist, loop through all liked artists to find if liked
    $scope.isFaved = function (mbid) {
        for (var i = 0; i < $scope.data.favlist.length; ++i) {
            if ($scope.data.favlist[i]['mbid'] === mbid) {
                console.log('TS');
                return true;
            }
        }
        return false;
    };

    $scope.search = function (keyword) {
        $scope.data.isLoading = true;
        console.log('search by name, ', keyword);
        userService.checkMyFavList().then(function (favlist) {
            console.log('favlist', favlist);
            $scope.data.favlist = favlist;
            userService.search(keyword, $scope.data.page).then(function succ (data) {
                console.log('search data', data);
                $scope.data.searchResult = data;
                $scope.data.isLoading = false;
                $scope.data.pristine = false;
            });
        }).catch(function (err) {
            console.log('err in search', err);
        });
    };

    $scope.searchArtist = function () {
        if ($scope.data.keyWord) {
            $scope.data.page = 1;
            $scope.data.keyWordCopy = $scope.data.keyWord;
            $scope.search($scope.data.keyWord);
        }
    };

    $scope.hasNext = function () {
        if ($scope.data.searchResult['page']) {
            console.log('page exits');
            var prevCount = ($scope.data.page - 1) * 10;
            var currentPageCount = $scope.data.searchResult['results'].length;
            var totalCount = prevCount + currentPageCount;
            if (totalCount < this.data.searchResult['total']) {
                return true;
            }
        }
        return false;
    };

    $scope.hasPrev = function () {
        if ($scope.data.searchResult['page']) {
            console.log('page exits');
            var prevCount = ($scope.data.page - 1) * 10;
            var currentPageCount = $scope.data.searchResult['results'].length;
            var totalCount = prevCount + currentPageCount;
            if (totalCount < this.data.searchResult['total']) {
                return true;
            }
        }
        return false;
    };

    $scope.nextPage = function () {
        $scope.data.page += 1;
        $scope.search($scope.data.keyWordCopy);
    };

    $scope.prevPage = function () {
        $scope.data.page -= 1;
        $scope.search($scope.data.keyWordCopy);
    };

    $scope.addToFavourite = function (singer) {
        if ($scope.data.isLoading) {
            return;
        }
        $scope.data.isLoading = true;
        console.log('about to add fav: ', singer);
        // copy list in case update error
        var newList = angular.copy($scope.data.favlist);
        newList.push(singer);
        userService.addNewToFavList(newList).then(function (favlist) {
            console.log('updated favlist', favlist);
            $scope.data.favlist = favlist;
            $scope.data.isLoading = false;
        }, function error (err) {
            console.error(err);
        })
    };

    $scope.init();
});
