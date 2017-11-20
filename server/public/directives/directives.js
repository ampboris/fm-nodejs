foundITApp.directive("seekerHeader", function() {
    return {
        restrict: 'E',
        templateUrl: 'directives/user.header.html',
        replace: true,
        scope: {
            logout: "&"
        }
    }
});
