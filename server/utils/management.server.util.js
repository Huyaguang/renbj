'use strict';

var VALUE = require('./value.server.util');

/**
 * 需要存在用户
 */
exports.requireUser = function (req, res, next) {
    if (!req.user) {
        res.json({
            status: 300011,
            msg: '无权限',
            data: {}
        });
        return;
    }
    next();
};

/**
 * 需要管理员权限
 */
exports.requireAdmin = function (req, res, next) {
    if (!req.user || req.user.role !== VALUE.USER_ROLE.ADMIN) {
        res.redirect('/login');
        return;
    }
    next();
};
