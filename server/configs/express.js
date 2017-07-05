'use strict';

var config = require('./config');
var mongoose = require('mongoose');
var path = require('path');
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var morgan = require('morgan');
var compress = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var passport = require('passport');
var hbs = require('hbs');

/**
 * express 包装模块
 */
module.exports = function () {
    var app, viewPath, staticPathPublic, staticPathClient, staticPathResource;
    app = express();

    if (process.env.NODE_ENV === 'production') {
        app.use(compress());
        app.use(morgan('dev'));
    } else {
        app.use(morgan('dev'));
    }

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret,
        store: new MongoStore({mongooseConnection: mongoose.connection}),
        cookie: {expires: new Date(2147483647000)}
    }));

    viewPath = path.resolve(__dirname, '../../client/views');
    app.set('views', viewPath);
    app.set('view engine', 'html');
    app.engine('html', hbs.__express);

    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());

    // 设置路由
    require('../routes/index.server.route.js')(app);
    require('../routes/user.server.route.js')(app);
    require('../routes/blog.server.route.js')(app);
    require('../routes/label.server.route.js')(app);

    // 最后执行静态文件服务
    staticPathPublic = path.resolve(__dirname, '../../public');
    app.use('/public', express.static(staticPathPublic));
    staticPathClient = path.resolve(__dirname, '../../client');
    app.use('/client', express.static(staticPathClient));
    staticPathResource = path.resolve(__dirname, '../../resource');
    app.use('/resource', express.static(staticPathResource));

    return app;
};
