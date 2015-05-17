'use strict';

angular.module('BookshelfApp.root', ['ui.router'])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('root', {
            url: '/',
            templateUrl: 'root/root.html',
            controller: 'RootCtrl'
        });
    }])

    .controller('RootCtrl', ['$scope', function ($scope) {
        $scope.toggled = function(open) {
            console.log('Dropdown is now: ', open);
        };
    }]);
