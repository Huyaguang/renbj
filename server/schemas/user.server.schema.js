'use strict';

// 定义“用户”模式
module.exports = function () {
    var userSchema = {
        // 创建时间，默认生成
        createdAt: {
            type: Date,
            required: true,
            default: Date.now
        },
        // 创建时间戳 (冗余数据，仅为兼容客户端)
        time: Number,
        // 注册手机号
        phone: {
            type: String,
            trim: true,
            index: true,
            unique: true,
            required: true
        },
        // 密码
        password: {
            type: String,
            trim: true,
            required: true,
            validate: [
                function (pwd) {
                    return pwd.length >= 6;
                },
                'Password too short!'
            ]
        },
        nickname: {
            type: String,
            required: true,
            unique: true
        },
        icon: String,
        // 加密盐
        salt: String,
        // Passport 鉴权相关信息
        provider: {
            type: String,
            required: 'Provider is required',
            default: 'local'
        },
        description: String
    };
    return userSchema;
};
