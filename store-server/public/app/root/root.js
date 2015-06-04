'use strict';

angular.module('BookshelfApp.root', ['ui.router'])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('root', {
            url: '/',
            templateUrl: 'root/root.html',
            controller: 'RootCtrl',
            resolve: {
                dataResource: 'sessionService',
                data: function(sessionService) {
                    return sessionService.loadSession()
                }
            }
        });
    }])

    .controller('RootCtrl', ['$scope', '$modal', 'authService', 'sessionService', 'AUTH_EVENTS',
        function ($scope, $modal, authService, sessionService, AUTH_EVENTS) {
        $scope.toggled = function(open) {
            console.log('Dropdown is now: ', open);
        };

        $scope.user = sessionService.user;
        $scope.isClerk = sessionService.isClerk();
        $scope.isCustomer = sessionService.isCustomer();

        $scope.$on(AUTH_EVENTS.loginSuccess, function() {
            console.log("Logged in:", sessionService.user);
            $scope.user = sessionService.user;
            $scope.isClerk = sessionService.isClerk();
            $scope.isCustomer = sessionService.isCustomer();
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
