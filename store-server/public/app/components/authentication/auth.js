'use strict';

angular.module('BookshelfApp.authentication.main', ['BookshelfApp.authentication.session', 'BookshelfApp.config.server'])
.service('authService', ['sessionService', 'ServerConfig', '$q', '$http',
        function (sessionService, ServerConfig, $q, $http) {

            /**
             * Loads the local session information about the user
             *
             * @returns {Promise} Resolves to the token data if successful, rejects otherwise
             */
            this.localLogin = function () {
                return sessionService.loadSession();
            };

            /**
             * Logs in a user in the system
             *
             * @param {String} email
             * @param {String} password
             * @returns {Promise} Resolves to the logged in user data if successful, rejects with an error otherwise
             */
            this.login = function (email, password) {
                var deferred = $q.defer();

                $http.post(ServerConfig.baseUrl + '/login', {
                    email: email,
                    password: password
                }).then(function (result) {
                    sessionService.createSession(result.data)
                        .then(function (data) {
                            deferred.resolve(data);
                        },
                        function (error) {
                            deferred.reject(error);
                        });
                }, function (error) {
                    deferred.reject(error.data.message);
                });

                return deferred.promise;
            };

            /**
             * Registers a user in the system
             *
             * @param {String} email
             * @param {String} scope
             * @param {String} password
             * @returns {Promise} Resolves to the registered user data if successful, rejects with an error otherwise
             */
            this.register = function (email, password) {
                var deferred = $q.defer();

                $http.post(ServerConfig.baseUrl + '/register', {
                    email: email,
                    password: password
                }).then(function (result) {
                    sessionService.createSession(result.data)
                        .then(function (data) {
                            deferred.resolve(data);
                        },
                        function (error) {
                            deferred.reject(error);
                        });
                }, function (error) {
                    deferred.reject(error.data.message);
                });

                return deferred.promise;
            };

            /**
             * Erases the user session information
             *
             * @returns void
             */
            this.logout = function () {
                sessionService.deleteSession();
            };
        }]
)
    .constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    });
