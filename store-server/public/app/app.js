'use strict';

// Declare app level module which depends on views, and components
angular.module('BookshelfApp', [
    'BookshelfApp.root',
    'BookshelfApp.home',
    'ui.bootstrap',
    'ui.router'
])
    .config(['$urlRouterProvider', function ($urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');
    }]);
