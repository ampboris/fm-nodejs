foundITApp.controller('loginController', ['$scope', '$location', 'toaster', 'authService', '$timeout', '_',
    function ($scope, $location, toaster, authService, $timeout, _) {
        $scope.init = function () {
            $scope.data = {
                form: {
                    name: '',
                    password: ''

                },
                showFormError: false
            };

            $scope.submit = function () {
                if ($scope.loginForm.$invalid) {
                    $scope.data.showFormError = true;
                    return;
                }
                console.log('loginController::submit! data:', JSON.stringify($scope.data.form, null, 2));
                var payload = _.pick($scope.data.form, ['name', 'password']);
                console.log('login with payload', payload);
                authService.loginIn(payload).then(function succ () {
                    // login successful!
                    toaster.pop('success', 'Login Success!', '');
                    $timeout(function () {
                        $scope.enterNext();
                    }, 1000);
                }, function err (err) {
                    // unsuccessful login
                    console.log('login error', err);
                    if (err.status === 401 || err.status === 403) {
                        toaster.pop('error', 'Login Failure!', 'Username and password mismatch!');
                    } else {
                        toaster.pop('error', 'Login Failure!', 'Other Error!');
                    }
                });

                // the short cut todo: remove after dev
                // $scope.enterNext();
            };

            $scope.enterNext = function () {
                $location.path('/user/search').replace();
            };

            $scope.singUp = function () {
                console.log('singup ');
                $location.path('/register');
            }

        };
        console.log('loginController::init');
        $scope.init();
    }]);


foundITApp.controller('logoutController', ['$scope', '$location', 'authService',
    function ($scope, $location, authService) {
        console.log('logoutController::init');
        authService.logOut();
    }]);
