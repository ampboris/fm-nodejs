foundITApp.controller('registerController', function ($scope, $location, authService, toaster, $timeout, _) {
    $scope.init = function () {

        // authService.logout();
        $scope.data = {
            form: {
                name: '',
                password: ''
            },
            showFormError: false
        };

        $scope.submit = function () {
            if ($scope.regForm.$invalid) {
                $scope.data.showFormError = true;
                return;
            }
            var payload = _.pick($scope.data.form, ['name', 'password']);
            console.log('registerController::submit! payload:', payload);
            authService.signUp(payload).then(function success () {
                console.log('sign up success');
                toaster.pop('success', 'Successful', 'Y' +
                    'ou can login now!');
                $timeout(function () {
                  $location.path('/user/search').replace();
                }, 1000);
            }, function error (err) {
                console.log('fail sign up', err);
                toaster.pop('error', 'Sign up error', err);
            });
        };

    };
    console.log('register::init');
    $scope.init();
});
