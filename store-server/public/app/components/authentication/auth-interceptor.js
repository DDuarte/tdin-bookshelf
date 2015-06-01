'use strict';

angular.module('BookshelfApp.authentication.interceptor', ['BookshelfApp.config.server'])
.factory('AuthInterceptor', [ '$injector', 'ServerConfig', function($injector, ServerConfig) {

    return {
        request: addToken
    };

    function addToken(config) {
        var sessionService = $injector.get('sessionService');

        if (!sessionService.user)
            return config;

        var token = sessionService.user.token;
        if (token && (config.url.indexOf(ServerConfig.baseUrl) > -1)) {
            config.headers = config.headers || {};
            config.headers.Authorization = 'Bearer ' + token;
        }

        return config;
    }

}]);