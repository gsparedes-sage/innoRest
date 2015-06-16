(function() {
    'use strict';

    var express = require('express');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    var config = require('./config');
    var http = require('http');

    var routes = require('./routes/index');

    var app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(cookieParser());

    app.use('/', routes);

    app.set('port', config.port);

    var server = http.createServer(app);

    server.listen(app.get('port'), function() {
        console.log('Express server listening on port ' + config.port);
    });

    module.exports = app;
}());
