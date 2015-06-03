'use strict';

angular.module('BookshelfApp.checkout', ['ui.router', 'BookshelfApp.root', 'ui.bootstrap'])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('root.checkout', {
            url: 'checkout',
            templateUrl: 'checkout/checkout.html',
            controller: 'CheckoutCtrl'
        });
    }])

    .controller('CheckoutCtrl', ['$scope', 'sessionService', 'SweetAlert', 'ngCart', 'lodash', 'OrderModel',
        function ($scope, sessionService, SweetAlert, ngCart, lodash, OrderModel) {
        /* sidebar hurdles */
        transparent = false;
        $('nav[role="navigation"]').removeClass('navbar-transparent').addClass('navbar-default'); // oh, no... Jquery!
        $(window).off('scroll');

        $scope.cartItems = ngCart.getItems();
        $scope.ngCart = ngCart;

        $scope.removeCartItem = function(index) {
            ngCart.removeItem(index);
            $scope.cartItems = ngCart.getItems();
        };

        $scope.checkout = function() {
            var items = lodash.map($scope.cartItems, function(item) {
                return {
                    id: item.getId(),
                    quantity: item.getQuantity()
                }
            });

            OrderModel.create(sessionService.user.id, {items: items})
            .then(function(Order) {
                ngCart.empty(true);
                $scope.cartItems = ngCart.getItems();
                SweetAlert.swal("Order successfully created", "", "success");
            })
            .catch(function(error) {
                SweetAlert.swal("Error creating order", error, "error");
            });
        }
    }]);
