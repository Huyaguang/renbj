'use strict';

var mongoose = require('mongoose');

// 定义“标签”模式
module.exports = function () {
    var labelSchema = {
        // 创建时间，默认生成
        createdAt: {
            type: Date,
            required: true,
            default: Date.now
        },
        // 标签的标题
        title: {
            type: String,
            unique: true,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        // 标签类型（1：普通，2：置顶，9：私密）
        labelType: {
            type: Number,
            required: true,
            default: 1
        },
        // 标签的描述
        description: String,
        // 博客的总数
        blogTotal: {
            type: Number,
            required: true,
            default: 0
        }
    };
    return labelSchema;
};
