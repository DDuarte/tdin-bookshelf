'use strict';

angular.module('BookshelfApp.product', ['ui.router', 'BookshelfApp.root', 'ui.bootstrap'])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('root.product', {
            url: 'products/:id',
            templateUrl: 'product/product.html',
            controller: 'ProductCtrl'
        });
    }])

    .controller('ProductCtrl', ['$scope', '$modal', function ($scope, $modal) {
        /* sidebar hurdles */
        transparent = false;
        $('nav[role="navigation"]').removeClass('navbar-transparent').addClass('navbar-default'); // oh, no... Jquery!
        $(window).off('scroll');

        $scope.login = function() {
            var modalInstance = $modal.open({
                templateUrl: 'login/loginDialog.html',
                controller: 'LoginDialogCtrl',
                resolve: {

                }
            });
        }
    }]);
