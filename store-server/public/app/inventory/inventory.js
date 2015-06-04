'use strict';

angular.module('BookshelfApp.inventory', ['ui.router', 'BookshelfApp.root', 'ui.bootstrap', 'ui.bootstrap-slider'])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('root.inventory', {
            url: 'inventory',
            templateUrl: 'inventory/inventory.html',
            controller: 'InventoryCtrl'
        });
    }])

    .controller('InventoryCtrl', ['$scope', '$modal', '$stateParams', 'SweetAlert', 'BookModel', 'lodash',
        function ($scope, $modal, $stateParams, SweetAlert, BookModel, lodash) {
            /* sidebar hurdles */
            transparent = false;
            $('nav[role="navigation"]').removeClass('navbar-transparent').addClass('navbar-default'); // oh, no... Jquery!
            $(window).off('scroll');

            BookModel.getAll().then(function (books) {
                $scope.books = books;
                $scope.total = lodash.sum(books, function (book) {
                    return book.stock * book.price;
                });
            }).catch(function (error) {
                $scope.books = [];
                $scope.total = 0;
                SweetAlert.swal("Error", error, "error");
            });

        }]);
