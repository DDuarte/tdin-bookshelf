'use strict';

angular.module('BookshelfApp.addProduct', ['ui.router', 'BookshelfApp.root', 'ui.bootstrap'])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('root.addProduct', {
            url: 'addProduct',
            templateUrl: 'addProduct/add_product.html',
            controller: 'AddProductCtrl'
        });
    }])

    .controller('AddProductCtrl', ['$scope', '$modal', '$q', 'BookModel', 'SweetAlert', '$state',
        function ($scope, $modal, $q, BookModel, SweetAlert, $state) {
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
            $scope.book.isbn = item.isbn.identifier;
        };

        $scope.createBook = function() {
            BookModel.create($scope.book)
            .then(function(NewBook) {
                SweetAlert.swal({
                        title: "Success",
                        text: "The book item was successfully created",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonText: "Ok",
                        closeOnConfirm: true},
                    function(){
                        $state.go('root.product', {id: NewBook.id});
                    });
            })
            .catch(function(message) {
                SweetAlert.swal("Error", message, "error");
            })
        };

        $scope.selected = null;
    }]);
