'use strict';

var mongoose = require('mongoose');

// 定义“博客”模式
module.exports = function () {
    var blogSchema = {
        // 创建时间，默认生成
        createdAt: {
            type: Date,
            required: true,
            default: Date.now
        },
        // 最后一次更新时间
        lastUpdateAt: {
            type: Date,
            required: true,
            default: Date.now
        },
        // 博客的标题
        title: {
            type: String,
            required: true
        },
        // 博客的作者
        author: {
            type: String,
            required: true
        },
        // 博客的内容
        content: {
            type: String,
            required: true
        },
        // 博客内容的URL
        contentUrl: {
            type: String,
            required: true
        },
        // 博客评论的总数
        commentTotal: {
            type: Number,
            required: true,
            default: 0
        },
        // 博客的点赞数
        supportTotal: {
            type: Number,
            required: true,
            default: 0
        },
        // 博客类型（1：普通，2：置顶，9：私密）
        blogType: {
            type: Number,
            required: true,
            default: 1
        },
        // 博客的标签
        label: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Label'
        }
    };
    return blogSchema;
};
