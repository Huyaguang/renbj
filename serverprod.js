'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

var config = require('./server/configs/config');
var express = require('./server/configs/express');

require('./server/configs/mongoose')();
require('./server/configs/passport')();

var app = express();
app.set('port', config.port);
app.listen(app.get('port'));

module.exports = app;
console.log('Server is running in http://localhost:' + app.get('port'));
