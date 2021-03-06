'use strict';

angular.module('BookshelfApp.myOrders', ['ui.router', 'BookshelfApp.root', 'ui.bootstrap'])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('root.myOrders', {
            url: 'myOrders',
            templateUrl: 'myOrders/myOrders.html',
            controller: 'MyOrdersCtrl'
        });

        $stateProvider.state('root.myOrdersDetails', {
            url: 'myOrders/:id',
            templateUrl: 'myOrders/myOrders_details.html',
            controller: 'MyOrdersDetailsCtrl'
        });
    }])

    .controller('MyOrdersCtrl', ['$scope', '$state', 'SweetAlert', 'sessionService', 'OrderModel', function ($scope, $state, SweetAlert, sessionService, OrderModel) {
        /* sidebar hurdles */
        transparent = false;
        $('nav[role="navigation"]').removeClass('navbar-transparent').addClass('navbar-default'); // oh, no... Jquery!
        $(window).off('scroll');

        OrderModel.getAllFromUser(sessionService.user.id)
        .then(function(Orders) {
            $scope.orderItems = Orders;
            console.log("Orders:", $scope.orderItems);
        })
        .catch(function(error) {
            SweetAlert.swal("Error", error, "error");
        });

        $scope.seeDetails = function(orderItem) {
            $state.go('root.myOrdersDetails', {id: orderItem.order.id});
        };
    }])
    .controller('MyOrdersDetailsCtrl', ['$scope', '$state', '$stateParams', 'sessionService', 'SweetAlert', 'OrderModel', 'lodash',
        function($scope, $state, $stateParams, sessionService, SweetAlert, OrderModel, lodash) {
        OrderModel.getFromUser(sessionService.user.id, $stateParams.id)
        .then(function(Order) {
            $scope.order = Order;
            $scope.order.total = lodash.reduce($scope.order.items, function(total, item) {
                return total + (item.price * item.OrderBook.quantity);
            }, 0);
            console.log("Order:", $scope.order);
        })
        .catch(function(error) {
            SweetAlert.swal("Error", error, "error");
        });
    }]);
