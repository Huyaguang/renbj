'use strict';

var mongoose = require('mongoose');
var LogModel = mongoose.model('Log');
var VALUE = require('../utils/value.server.util');

/**
 * 用户注册记录日志
 * @param {Object} req  中包含了所有的公共信息
 * @param {Object} user 用户信息
 */
exports.recordRegisterLog = function (req, user) {
    var log = new LogModel({
        logType: VALUE.LOG_TYPE.REGISTER,
        userId: user._id,
        loginAccount: user.phoneAccount,
        userIp: req.body.ip,
        developerId: req.body.developerId,
        gameId: req.body.gameId
    });
    log.save(function (err) {
        if (!!err) {
            console.log('注册日志错误');
            console.log(err);
            return;
        }
    });
};

/**
 * 用户登陆记录日志
 * 判断 req.body.account 的后缀，然后判断是游客登录还是账号登陆，最后记入对应的日志中
 * @param {Object} req  中包含了所有的公共信息
 * @param {Object} user 用户信息
 */
exports.recordLoginLog = function (req, user) {
    var logType, loginAccount;
    if (req.body.account.indexOf(VALUE.ACCOUNT_SUFFIX.MOBILE) >= 0) {
        logType = VALUE.LOG_TYPE.LOGIN_MOBILE;
        loginAccount = user.phoneAccount;
    } else if (req.body.account.indexOf(VALUE.ACCOUNT_SUFFIX.TRYGAME) >= 0) {
        logType = VALUE.LOG_TYPE.LOGIN_TRYGAME;
        loginAccount = user.tryGameAccount;
    } else {
        console.log('登陆日志错误');
        return;
    }
    var log = new LogModel({
        logType: logType,
        userId: user._id,
        loginAccount: loginAccount,
        userIp: req.body.ip,
        developerId: req.body.developerId,
        gameId: req.body.gameId
    });
    log.save(function (err) {
        if (!!err) {
            console.log('登陆日志错误');
            console.log(err);
            return;
        }
    });
};
