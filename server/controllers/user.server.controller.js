'use strict';

var mongoose = require('mongoose');
var passport = require('passport');

var UserModel = mongoose.model('User');

var utils = require('../utils/utils.server.util');
var VALUE = require('../utils/value.server.util');

var login = function (user, req, res) {
    // 这里调用 passport 中间件的 req.login 函数
    // passport 会自动建立与用户的 session 连接
    req.login(user, function (err) {
        if (!!err) {
            console.log(err);
            utils.respondFailure(res, '登录失败');
            return;
        }
        utils.respondSuccess(res, user, '登录成功');
    });
};

/**
 * 用户注册
 * @body {String} verification 验证信息
 * @body {String} nickname     用户昵称
 * @body {String} phone        用户手机号
 * @body {String} password     用户密码
 */
exports.signup = function (req, res) {
    if (!!req.user) {
        utils.respondFailure(res, '用户已登录');
        return;
    }
    if (!req.body.verification || req.body.verification !== VALUE.SIGNUP_VERIFICATION) {
        utils.respondFailure(res, '验证信息错误，请联系此网站所属者');
        return;
    }
    if (!req.body.nickname || !req.body.phone || !req.body.password) {
        utils.respondFailure(res, '注册信息不完整');
        return;
    }
    var user = new UserModel({
        nickname: req.body.nickname,
        phone: req.body.phone,
        password: req.body.password
    });
    user.save(function (err) {
        if (!!err) {
            utils.respondFailure(res, '注册失败');
            return;
        }
        console.log(user);
        login(user, req, res);
    });
};

/**
 * 用户登录
 * @body {String} phone    用户账号
 * @body {String} password 账号密码
 */
exports.signin = function (req, res, next) {
    if (!!req.user) {
        req.user = null;
    }

    passport.authenticate('local', function (err, user, result) {
        if (!!err) {
            utils.respondFailure(res, err);
            return;
        }
        if (!user) {
            res.json({
                status: result.errCode || 0,
                msg: result.message || '账号或者密码错误',
                data: {}
            });
            return;
        }
        user.password = null;
        login(user, req, res);
    })(req, res, next);
};

/**
 * 用户登出
 */
exports.signout = function (req, res) {
    req.logout();
    utils.respondSuccess(res, null, 'logout successful');
};

/**
 * 用户修改密码
 * @body {String} verification     验证信息
 * @body {String} phone            用户的手机号
 * @body {String} newPassword      用户的新密码
 * @body {String} newPasswordAgain 再次输入的新密码
 */
exports.resetPassword = function (req, res) {
    if (!req.body.verification || req.body.verification !== VALUE.UPDATE_PASSWORD_VERIFICATION) {
        utils.respondFailure(res, '验证信息错误，请联系此网站所属者');
        return;
    }
    if (!req.body.phone || !req.body.newPassword || !req.body.newPasswordAgain) {
        utils.respondFailure(res, '信息不完整，请联系此网站所属者');
        return;
    }
    if (req.body.newPassword !== req.body.newPasswordAgain) {
        utils.respondFailure(res, '两次输入的密码不一致，请重新输入');
        return;
    }
    UserModel.findOne({phone: req.body.phone}, function (err, user) {
        if (!!err) {
            utils.respondFailure(res, '数据错误');
            return;
        }
        if (!user) {
            utils.respondFailure(res, '无此手机号的用户，请检查后输入');
            return;
        }
        user.password = req.body.newPassword;
        user.save(function (err) {
            if (!!err) {
                utils.respondFailure(res, '修改失败，请重试');
                return;
            }
            utils.respondSuccess(res);
        });
    });
};
var path = require('path');

/**
 * 打开注册界面
 */
exports.signupHtml = function (req, res) {
    res.sendFile(path.resolve(__dirname, '../../client/html/mainpage/signup.client.view.html'));
};

/**
 * 打开登录界面
 */
exports.loginHtml = function (req, res) {
    res.sendFile(path.resolve(__dirname, '../../client/html/mainpage/signin.client.view.html'));
};

/**
 * 打开更改密码界面
 */
exports.resetPasswordHtml = function (req, res) {
    res.sendFile(path.resolve(__dirname, '../../client/html/mainpage/resetpassword.client.view.html'));
};

exports.favicon = function (req, res) {
    res.download(path.resolve(__dirname, '../../resource/favicon.ico'));
};

exports.getUserInfo = function (req, res) {
    var userId;
    if (!!req.user) {
        userId = req.user._id;
    } else {
        userId = VALUE.MASTER_ID;
    }
    UserModel.findById(userId, '-password -salt -provider', function (err, user) {
        if (!!err) {
            utils.respondFailure(res);
            return;
        }
        utils.respondSuccess(res, {
            description: user.description,
            nickname: user.nickname
        });
    });
};
