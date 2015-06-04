'use strict';

angular.module('BookshelfApp.home', ['ui.router', 'BookshelfApp.root'])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('root.home', {
            url: 'home',
            templateUrl: 'home/home.html',
            controller: 'HomeCtrl'
        });
    }])

    .controller('HomeCtrl', ['$scope', 'BookModel', 'SweetAlert', function ($scope, BookModel, SweetAlert) {
        BookModel.getLatest().then(function (books) {
            $scope.latestBooks = books;
            console.log(JSON.stringify(books));
        }).catch(function (error) {
            SweetAlert.swal("Error", error, "error");
        });
    }]);
