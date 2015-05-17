'use strict';

angular.module('BookshelfApp.home', ['ui.router', 'BookshelfApp.root'])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('root.home', {
            url: 'home',
            templateUrl: 'home/home.html',
            controller: 'HomeCtrl'
        });
    }])

    .controller('HomeCtrl', [function () {

    }]);