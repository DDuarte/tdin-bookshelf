'use strict';

angular.module('BookshelfApp.root', ['ui.router'])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('root', {
            url: '/',
            templateUrl: 'root/root.html',
            controller: 'RootCtrl'
        });
    }])

    .controller('RootCtrl', ['$scope', '$modal', 'authService', 'sessionService', 'AUTH_EVENTS',
        function ($scope, $modal, authService, sessionService, AUTH_EVENTS) {
        $scope.toggled = function(open) {
            console.log('Dropdown is now: ', open);
        };

        sessionService.loadSession()
            .then(function() {
                $scope.user = sessionService.user;
            });

        $scope.$on(AUTH_EVENTS.loginSuccess, function() {
            console.log("Logged in:", sessionService.user);
            $scope.user = sessionService.user;
        });

        $scope.signin = function() {
            var modalInstance = $modal.open({
                templateUrl: 'login/loginDialog.html',
                controller: 'LoginDialogCtrl'
            });
        };

        $scope.logout = function() {
            authService.logout();
            $scope.user = null;
        };
    }]);
