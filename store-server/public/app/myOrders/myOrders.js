'use strict';

angular.module('BookshelfApp.myOrders', ['ui.router', 'BookshelfApp.root', 'ui.bootstrap'])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('root.myOrders', {
            url: 'myOrders',
            templateUrl: 'myOrders/myOrders.html',
            controller: 'MyOrdersCtrl'
        });
    }])

    .controller('MyOrdersCtrl', ['$scope', function ($scope) {
        /* sidebar hurdles */
        transparent = false;
        $('nav[role="navigation"]').removeClass('navbar-transparent').addClass('navbar-default'); // oh, no... Jquery!
        $(window).off('scroll');


    }]);
