'use strict';

var mongoose = require('mongoose');
var paginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var blogSchema = require('../schemas/blog.server.schema')();

// 创建 Mongoose “博客”模式
var blogMongooseSchema = new mongoose.Schema(blogSchema);
// 设置索引
blogMongooseSchema.index({createdAt: -1, author: 1}, {lastUpdateAt: -1, author: 1});
// 使用插件
blogMongooseSchema.plugin(paginate);
blogMongooseSchema.plugin(uniqueValidator);

// 数据保存之前的处理
blogMongooseSchema.pre('save', function (next) {
    this.lastUpdateAt = new Date();
    next();
});

// 创建“用户”模型
mongoose.model('Blog', blogMongooseSchema);
