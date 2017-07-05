'use strict';

var crypto = require('crypto');
var mongoose = require('mongoose');
var paginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var userSchema = require('../schemas/user.server.schema')();

// 创建 Mongoose “用户”模式
var userMongooseSchema = new mongoose.Schema(userSchema);
// 设置索引
userMongooseSchema.index({createdAt: -1, phone: 1, nickname: 1});
// 使用插件
userMongooseSchema.plugin(paginate);
userMongooseSchema.plugin(uniqueValidator);

// 数据保存之前的处理
userMongooseSchema.pre('save', function (next) {
    var self = this;

    // 密码为空，直接交由下一阶段处理 (模型层面会对密码格式进行验证)
    if (!this.password) {
        next();
        return;
    }
    this.time = this.createdAt.valueOf();
    this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
    this.encryptPassword(this.password, function (err, password) {
        if (!!err) {
            next(err);
            return;
        }
        self.password = password;
        next();
    });
});

/**
 * 对密码进行加密处理
 * @param {String}   plainPassword 密码
 * @param {Function} done          处理完毕之后的回调
 */
userMongooseSchema.methods.encryptPassword = function (plainPassword, done) {
    crypto.pbkdf2(plainPassword, this.salt, 10000, 64, function (err, password) {
        done(err, password.toString('base64'));
    });
};
/**
 * 验证密码是否一致
 * @param {String}   plainPassword 密码
 * @param {Function} done          处理完毕之后的回调
 */
userMongooseSchema.methods.authenticatePassword = function (plainPassword, done) {
    var self = this;
    self.encryptPassword(plainPassword, function (err, password) {
        if (!!err) {
            done(false);
            return;
        }
        done(self.password === password);
    });
};

// 创建“用户”模型
mongoose.model('User', userMongooseSchema);
