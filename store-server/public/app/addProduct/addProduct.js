'use strict';

angular.module('BookshelfApp.addProduct', ['ui.router', 'BookshelfApp.root', 'ui.bootstrap'])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('root.addProduct', {
            url: 'addProduct',
            templateUrl: 'addProduct/add_product.html',
            controller: 'AddProductCtrl'
        });
    }])

    .controller('AddProductCtrl', ['$scope', '$modal', '$q', 'BookModel', function ($scope, $modal, $q, BookModel) {
        /* sidebar hurdles */
        transparent = false;
        $('nav[role="navigation"]').removeClass('navbar-transparent').addClass('navbar-default'); // oh, no... Jquery!
        $(window).off('scroll');

        $scope.book = {};
        $scope.isbnSuggestions = [];

        $scope.getBooksByISBN = function(val) {
            return BookModel.searchByISBN(val)
                .then(function(books) {
                    return books;
                });
        };

        $scope.getBooksByTitle = function(val) {
            return BookModel.searchByTitle(val)
                .then(function(books) {
                    return books;
                });
        };

        $scope.selectBook = function(item) {
            $scope.book = item;
            $scope.book.stock = 0;
            if (!$scope.book.thumbnail)
                $scope.book.thumbnail = 'http://lorempixel.com/128/189/abstract/no%20thumbnail/';
        };

        $scope.createBook = function() {

        };

        $scope.selected = null;
    }]);
