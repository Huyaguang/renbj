'use strict';

var mongoose = require('mongoose');
var UserModel = mongoose.model('User');

/**
 * Passport 的用户序列化规则
 */
exports.serialize = function (user, done) {
    done(null, user._id);
};
/**
 * Passport 的用户反序列化规则
 */
exports.deserialize = function (id, done) {
    UserModel.findOne({_id: id}, '-password -salt', function (err, user) {
        done(err, user);
    });
};

/**
 * Passport 的开发者账号的验证规则
 * @body {String}   phone    开发者的账号
 * @body {String}   password 开发者的密码
 * @body {Function} done     执行完毕之后的回调
 */
exports.userAuthenticate = function (phone, password, done) {
    UserModel.findOne({phone: phone}, function (err, user) {
        if (!!err) {
            done(err);
            return;
        }
        if (!user) {
            done(null, false, {errCode: 300005, message: '用户不存在'});
            return;
        }
        user.authenticatePassword(password, function (isAuthenticated) {
            if (!isAuthenticated) {
                done(null, false, {errCode: 300007, message: '密码错误'});
            } else {
                done(null, user);
            }
        });
    });
};
