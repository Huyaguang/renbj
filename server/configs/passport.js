'use strict';

var account = require('./account');
var passport = require('passport');
var localStrategy = require('passport-local');

/**
 * passport 包装模块
 */
module.exports = function () {
    // 使用 local 策略来验证用户请求
    var userStrategy = new localStrategy.Strategy({
        usernameField: 'phone',
        passwordField: 'password'
    }, account.userAuthenticate);

    passport.use('local', userStrategy);

    // 为保持 session 的持续连接，需要先定义用户验证规则
    passport.serializeUser(account.serialize);
    passport.deserializeUser(account.deserialize);
};
