'use strict';

angular.module('BookshelfApp.models.order', [])

    .service('OrderModel', ['ServerConfig', '$q', '$http', function(ServerConfig, $q, $http) {

        this.create = function(order) {
            var deferred = $q.defer();

            $http.post(ServerConfig.baseUrl + '/orders', order)
                .then(function(result) {
                    return deferred.resolve(result.data);
                })
                .catch(function(error) {
                    return deferred.reject(error.data.message);
                });

            return deferred.promise;
        };

    }]);