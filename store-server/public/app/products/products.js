'use strict';

angular.module('BookshelfApp.products', ['ui.router', 'BookshelfApp.root', 'ui.bootstrap', 'ui.bootstrap-slider'])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('root.products', {
            url: 'products',
            templateUrl: 'products/products.html',
            controller: 'ProductsCtrl'
        });
    }])

    .controller('ProductsCtrl', ['$scope', '$modal', '$stateParams', 'SweetAlert', 'BookModel', 'ngCart',
        function ($scope, $modal, $stateParams, SweetAlert, BookModel, ngCart) {
            /* sidebar hurdles */
            transparent = false;
            $('nav[role="navigation"]').removeClass('navbar-transparent').addClass('navbar-default'); // oh, no... Jquery!
            $(window).off('scroll');

            BookModel.getAll().then(function (books) {
                $scope.books = books;
            }).catch(function (error) {
                SweetAlert.swal("Error", error, "error");
            });

            $scope.searchOptions = {
                minPrice: 0,
                maxPrice: 1000
            };

            $scope.filterExpression = function (book) {
                console.log(book.price);
                return book.price >= $scope.searchOptions.model[0] && book.price <= $scope.searchOptions.model[1];
            };
        }]);
