// SERVICES
foundITApp.service('authService', function ($q, httpService, StorageService, $location) {
    var self = {
        signUp: function (data) {
            console.log('authService::signUp called!');
            var d = $q.defer();
            httpService.postData('api/users', data).then(function success (response) {
                var authToken = response.headers()['x-auth'];
                if (authToken) { // store auth token
                    console.log('storerge', authToken);
                    StorageService.storeAuthToken(authToken);
                    console.log('storerge get', StorageService.getAuthToken());
                }
                console.log('signUp response', response);
                d.resolve();
            }, function error (err) {
                console.log('signUp error', err);
                d.reject(err);
            });
            return d.promise;
        },

        loginIn: function (data) {
            console.log('authService::login called!');
            var d = $q.defer();
            httpService.postData('api/users/login', data).then(function success (res) {
                var authToken = res.headers()['x-auth'];
                if (authToken) { // store auth token
                    console.log('storerge', authToken);
                    StorageService.storeAuthToken(authToken);
                    console.log('storerge get', StorageService.getAuthToken());
                }
                d.resolve();
            }, function error (err) {
                console.log('login error', err);
                d.reject(err);
            });
            return d.promise;
        },

        logOut: function () {
            console.log('authService::logout called!');
            console.log('token is ', StorageService.getAuthToken());
            httpService.deleteData('api/users/me/token').then(function (res) {
                console.log('Deleted Remote token');
            }).then(function () {
                StorageService.clear(); // clear local token
                $location.path('/').replace();
            }).catch(function (err) {
                console.error(err);
                StorageService.clear();
                $location.path('/').replace();
            })
        }
    };
    return self;
});