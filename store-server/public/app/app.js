'use strict';

// Declare app level module which depends on views, and components
angular.module('BookshelfApp', [
    'BookshelfApp.root',
    'BookshelfApp.home',
    'BookshelfApp.product',
    'BookshelfApp.checkout',
    'BookshelfApp.models',
    'BookshelfApp.addProduct',
    'BookshelfApp.myOrders',
    'BookshelfApp.config.server',
    'BookshelfApp.authentication.session',
    'BookshelfApp.authentication.main',
    'BookshelfApp.authentication.interceptor',
    'BookshelfApp.login',
    'ui.bootstrap',
    'ui.router',
    'autocomplete',
    'oitozero.ngSweetAlert',
    'ngLodash'
])
    .config(['$urlRouterProvider', '$httpProvider', function ($urlRouterProvider, $httpProvider) {

        $httpProvider.interceptors.push('AuthInterceptor');

        $urlRouterProvider.otherwise('/home');
    }]);
