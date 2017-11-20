// ROUTES
foundITApp.config(function ($routeProvider) {
    $routeProvider

        .when('/', {
            templateUrl: 'pages/login/login.html',
            controller: 'loginController'
        })

        .when('/logout', {
            templateUrl: 'pages/logout/logout.html',
            controller: 'logoutController'
        })

        .when('/user/search', {
            templateUrl: 'pages/user/user.html',
            cache: false,
            controller: 'userSearchCtrl'
        })

        .when('/user/myfav', {
            templateUrl: 'pages/user/user.application.html',
            cache: false,
            controller: 'userAppListCtrl'
        })

        .when('/register', {
            templateUrl: 'pages/register/register.html',
            controller: 'registerController'
        })
});
