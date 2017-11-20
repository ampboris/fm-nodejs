// SERVICES
foundITApp.service('userService', function ($q, httpService) {
    var self = {
        getJobList: function () {
            var d = $q.defer();
            httpService.getData('api/jobs').then(function success (response) {
                console.log('seekerService getData response', response);
                d.resolve(response.data);
            }, function error (err) {
                console.log('seekerService::getData Error', err);
                d.reject(err);
            });
            return d.promise;
        },

        searchJobs: function (title) {
            var d = $q.defer();
            httpService.getData('api/jobs?title=' + title).then(function success (response) {
                console.log('seekerService getData response', response);
                d.resolve(response.data);
            }, function error (err) {
                console.log('seekerService::getData Error', err);
                d.reject(err);
            });
            return d.promise;
        },

        applyJob: function (application) {
            var d = $q.defer();
            httpService.postData('api/apply', application).then(function success (response) {
                console.log('seekerService apply response', response);
                d.resolve(response.data);
            }, function error (err) {
                console.log('seekerService::apply error', err);
                d.reject(err);
            });
            return d.promise;
        },

        addNewToFavList: function (list) {
            var d = $q.defer();
            httpService.putData('api/users/favourites', list).then(function success (response) {
                console.log('favourites response', response);
                var favlist = response.data;
                if (favlist && favlist.length > 0) {
                    d.resolve(favlist);
                } else {
                    d.resolve([]);
                }
            }, function error (err) {
                console.log('seekerService:: error checkMyApplication', err);
                d.reject(err);
            });
            return d.promise;
        },

        checkMyFavList: function () {
            var d = $q.defer();
            httpService.getData('api/users/favourites').then(function success (response) {
                console.log('favourites response', response);
                var favlist = response.data;
                if (favlist && favlist.length > 0) {
                    d.resolve(favlist);
                } else {
                    d.resolve([]);
                }
            }, function error (err) {
                console.log('seekerService:: error checkMyApplication', err);
                d.reject(err);
            });
            return d.promise;
        },

        search: function (artist, page) {
            var d = $q.defer();
            httpService.getData('api/artist', {artist: artist, page: page}).then(function success (response) {
                console.log('artistService response', response);
                var respData = response.data;
                d.resolve(respData);

                // if (appInfos && appInfos.length > 0) {
                //     console.log('fire promise all to get job by jobID');
                //     self.getJobsByIds(appInfos).then(function (jobInfosResponse) {
                //         console.log('job infos', jobInfosResponse);
                //         for (var index = 0; index < appInfos.length; ++index) {
                //             appInfos[index].jobTitle = jobInfosResponse[index].data.title;
                //         }
                //         console.log('added title to application', appInfos);
                //         d.resolve(appInfos);
                //     }, function (err) {
                //         d.reject(err);
                //     });
                // } else {
                //     d.resolve([]);
                // }
            }, function error (err) {
                console.log('seekerService:: error checkMyApplication', err);
                d.reject(err);
            });
            return d.promise;
        },

        upDateApplication: function (application) {
            var d = $q.defer();
            httpService.putData('api/apply', application).then(function success (response) {
                console.log('seekerService apply update response', response);
                d.resolve(response.data);
            }, function error (err) {
                console.log('seekerService::apply update error', err);
                d.reject(err);
            });
            return d.promise;
        },

        getJobsByIds: function (appInfos) {
            var getJobPromises = [];
            angular.forEach(appInfos, function (app) {
                console.log('jbid', app.jobID);
                var getSingleJob = httpService.getData('api/jobs/' + app.jobID);
                getJobPromises.push(getSingleJob);
            });
            return $q.all(getJobPromises);
        }
    };
    return self;
});
