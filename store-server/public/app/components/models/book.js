'use strict';

angular.module('BookshelfApp.models.book', [])

    .service('BookModel', ['ServerConfig', '$q', '$http', function(ServerConfig, $q, $http) {
        this.searchByTitle = function(title) {
            var deferred = $q.defer();

            $http.get(ServerConfig.baseUrl + '/books/search/' + title, {params: {field: 'title'}})
            .then(function(result) {
                return deferred.resolve(result.data);
            })
            .catch(function(error) {
                return deferred.reject(error.data.message);
            });

            return deferred.promise;
        };

        this.searchByISBN = function(ISBN) {
            var deferred = $q.defer();

            $http.get(ServerConfig.baseUrl + '/books/search/' + ISBN, {params: {field: 'ISBN'}})
                .then(function(result) {
                    return deferred.resolve(result.data);
                })
                .catch(function(error) {
                    return deferred.reject(error.data.message);
                });

            return deferred.promise;
        };

        this.create = function(book) {
            var deferred = $q.defer();

            $http.post(ServerConfig.baseUrl + '/books', book)
                .then(function(result) {
                    return deferred.resolve(result.data);
                })
                .catch(function(error) {
                    return deferred.reject(error.data.message);
                });

            return deferred.promise;
        };

    }]);