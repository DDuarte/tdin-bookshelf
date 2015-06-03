'use strict';

angular.module('BookshelfApp.authentication.session', ['LocalForageModule'])
.service('sessionService', ['$q', '$localForage', '$http', 'ServerConfig', '$state',
    function ($q, $localForage, $http, ServerConfig) {

        this.user = {};

        /**
         * Sets the user session information
         * @param userData User data to be persisted
         * @returns true if operation was successful, false otherwise
         */
        this.createSession = function (userData) {
            var deferred = $q.defer();
            var self = this;
            this.user = userData;
            $localForage.setItem('user', JSON.stringify(userData))
                .then(function () {
                    return deferred.resolve(self.user);
                },
                function () {
                    return deferred.reject('Error storing user session in local storage');
                });

            return deferred.promise;
        };

        /**
         * Loads the user session from local storage
         *
         * @returns {Promise} Resolves to the user data if successful, rejects otherwise
         */
        this.loadSession = function () {
            var deferred = $q.defer();
            var self = this;
            $localForage.getItem('user')
                .then(function (data) {
                    if (!data) {
                        console.log("No user session was found");
                        return deferred.reject('No user session was found');
                    }

                    try {
                        self.user = JSON.parse(data);
                        return deferred.resolve(self.data);
                    } catch (ex) {
                        return deferred.reject('User session was corrupted');
                    }
                });

            return deferred.promise;
        };

        /**
         * Erases the user session information
         * @returns void
         */
        this.deleteSession = function () {
            this.user = null;
            $localForage.removeItem('user');
        };

    }]);