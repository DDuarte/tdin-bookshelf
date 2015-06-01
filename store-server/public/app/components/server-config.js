'use strict';

angular.module('BookshelfApp.config.server', [])

.provider('ServerConfig', [function () {
    var baseUrl = {
        dev: 'http://localhost:8000/api',
        bin: 'http://www.bookshelf.com/api'
    };

    var baseDomain = {
        dev: 'http://localhost:8000/',
        bin: 'http://www.bookshelf.com/'
    };

    this.baseUrl = baseUrl.dev;
    this.baseDomain = baseDomain.dev;

    var self = this;
    this.$get = function() {
        return {
            baseUrl: self.baseUrl,
            baseDomain: self.baseDomain
        };
    };

    this.setProductionMode = function(productionMode) {
        if (productionMode)
            this.baseUrl = baseUrl.bin;
        else
            this.baseUrl = baseUrl.dev;
    }
}]);