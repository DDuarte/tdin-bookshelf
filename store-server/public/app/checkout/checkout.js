'use strict';

angular.module('BookshelfApp.checkout', ['ui.router', 'BookshelfApp.root', 'ui.bootstrap'])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('root.checkout', {
            url: 'checkout',
            templateUrl: 'checkout/checkout.html',
            controller: 'CheckoutCtrl'
        });
    }])

    .controller('CheckoutCtrl', ['$scope', 'ngCart', function ($scope, ngCart) {
        /* sidebar hurdles */
        transparent = false;
        $('nav[role="navigation"]').removeClass('navbar-transparent').addClass('navbar-default'); // oh, no... Jquery!
        $(window).off('scroll');

        $scope.cartItems = ngCart.getItems();
        $scope.ngCart = ngCart;

        $scope.removeCartItem = function(index) {
            ngCart.removeItem(index);
            $scope.cartItems = ngCart.getItems();
        }

        $scope.checkout = function() {

        }
    }]);
