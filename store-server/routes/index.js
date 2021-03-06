'use strict';

module.exports = function(server) {
    require('./auth')(server);
    require('./users')(server);
    require('./orders')(server);
    require('./search')(server);
    require('./books')(server);
};