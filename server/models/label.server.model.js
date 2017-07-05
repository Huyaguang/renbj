'use strict';

var mongoose = require('mongoose');
var paginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var labelSchema = require('../schemas/label.server.schema')();

// 创建 Mongoose “标签”模式
var labelMongooseSchema = new mongoose.Schema(labelSchema);
// 设置索引
labelMongooseSchema.index({createdAt: -1}, {blogTotal: -1});
// 使用插件
labelMongooseSchema.plugin(paginate);
labelMongooseSchema.plugin(uniqueValidator);

// 创建“用户”模型
mongoose.model('Label', labelMongooseSchema);
