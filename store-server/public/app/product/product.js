'use strict';

angular.module('BookshelfApp.product', ['ui.router', 'BookshelfApp.root', 'ui.bootstrap'])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('root.product', {
            url: 'products/:id',
            templateUrl: 'product/product.html',
            controller: 'ProductCtrl'
        });
    }])

    .controller('ProductCtrl', ['$scope', '$modal', '$stateParams', 'SweetAlert', 'BookModel',
        function ($scope, $modal, $stateParams, SweetAlert, BookModel) {
        /* sidebar hurdles */
        transparent = false;
        $('nav[role="navigation"]').removeClass('navbar-transparent').addClass('navbar-default'); // oh, no... Jquery!
        $(window).off('scroll');

        BookModel.getById($stateParams.id)
        .then(function(Book) {
            $scope.book = Book;
        })
        .catch(function(error) {
            SweetAlert.swal("Error", error, "error");
        });

        $scope.login = function() {
            var modalInstance = $modal.open({
                templateUrl: 'login/loginDialog.html',
                controller: 'LoginDialogCtrl',
                resolve: {

                }
            });
        }
    }]);
