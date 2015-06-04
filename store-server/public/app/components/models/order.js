'use strict';

angular.module('BookshelfApp.models.order', [])

    .service('OrderModel', ['ServerConfig', 'sessionService', '$q', '$http', function(ServerConfig, sessionService, $q, $http) {

        this.create = function(userId, order) {
            var deferred = $q.defer();

            $http.post(ServerConfig.baseUrl + '/users/' + userId + '/orders', order)
                .then(function(result) {
                    return deferred.resolve(result.data);
                })
                .catch(function(error) {
                    return deferred.reject(error.data.message);
                });

            return deferred.promise;
        };

        this.getAll = function() {
            var deferred = $q.defer();

            $http.get(ServerConfig.baseUrl + '/orders')
                .then(function(result) {
                    return deferred.resolve(result.data);
                })
                .catch(function(error) {
                    return deferred.reject(error.data.message);
                });

            return deferred.promise;
        };

        this.getAllFromUser = function(userId) {
            var deferred = $q.defer();

            $http.get(ServerConfig.baseUrl + '/users/' + userId + '/orders')
            .then(function(result) {
                return deferred.resolve(result.data);
            })
            .catch(function(error) {
                return deferred.reject(error.data.message);
            });

            return deferred.promise;
        };

        this.getFromUser = function(userId, orderId) {
            var deferred = $q.defer();

            $http.get(ServerConfig.baseUrl + '/users/' + userId + '/orders/' + orderId)
            .then(function(result) {
                return deferred.resolve(result.data);
            })
            .catch(function(error) {
                return deferred.reject(error.data.message);
            });

            return deferred.promise;
        };

    }]);