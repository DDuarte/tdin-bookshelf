'use strict';

angular.module('BookshelfApp.product', ['ui.router', 'BookshelfApp.root', 'ui.bootstrap'])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('root.product', {
            url: 'products/:id',
            templateUrl: 'product/product.html',
            controller: 'ProductCtrl'
        });
    }])

    .controller('ProductCtrl', ['$scope', '$modal', '$stateParams', 'SweetAlert', 'BookModel', 'ngCart',
        function ($scope, $modal, $stateParams, SweetAlert, BookModel, ngCart) {
        /* sidebar hurdles */
        transparent = false;
        $('nav[role="navigation"]').removeClass('navbar-transparent').addClass('navbar-default'); // oh, no... Jquery!
        $(window).off('scroll');

        BookModel.getById($stateParams.id)
        .then(function(Book) {
            $scope.book = Book;
            $scope.quantity = 1;
        })
        .catch(function(error) {
            SweetAlert.swal("Error", error, "error");
        });

        $scope.addToCart = function() {

            if (!$scope.quantity) {
                SweetAlert.swal("Please, specify a purchase quantity", "", "error");
                return;
            }
            ngCart.addItem(
                $scope.book.id,
                $scope.book.title,
                $scope.book.price,
                $scope.quantity,
                {
                    thumbnail: $scope.book.thumbnail,
                    isbn: $scope.book.ISBN
                }
            );

            SweetAlert.swal("Item added to cart", "", "success");
        };
    }]);
