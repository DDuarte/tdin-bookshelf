'use strict';

angular.module('BookshelfApp.login', [])

    .controller('LoginDialogCtrl', ['$rootScope', '$scope', '$modalInstance', 'authService', 'AUTH_EVENTS',
        function ($rootScope, $scope, $modalInstance, authService, AUTH_EVENTS) {

        $scope.loginMode = true;
        $scope.login = {};
        $scope.register = {};

        $scope.login = function () {
            authService.login($scope.login.email, $scope.login.password)
                .then(function () {
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                    $modalInstance.close();
                })
                .catch(function (error) {
                    $scope.authError = error;
                });
        };

        $scope.register = function() {
            authService.register($scope.register.email, $scope.register.password)
                .then(function() {
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                    $modalInstance.close();
                })
                .catch(function(error) {
                    $scope.authError = error;
                });
        };

        $scope.switchLoginMode = function() {
            $scope.authError = null;
            $scope.loginMode = !$scope.loginMode;
        }
    }]);
