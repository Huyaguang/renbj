'use strict';

var path = require('path');
var mongoose = require('mongoose');

var BlogModel = mongoose.model('Blog');
var UserModel = mongoose.model('User');
var LabelModel = mongoose.model('Label');

var utils = require('../utils/utils.server.util');
var VALUE = require('../utils/value.server.util');

/**
 * 添加博客
 * @body {String} title   博客标题
 * @body {String} author  博客作者
 * @body {String} content 博客内容
 * @body {String} label   博客所属标签的ID
 */
exports.add = function (req, res) {
    console.log(req.body);
    if (!req.body.title || !req.body.author || !req.body.content || !req.body.label) {
        utils.respondFailure(res, '请求参数不完整');
        return;
    }
    var blog = new BlogModel({
        title: req.body.title,
        author: req.body.author,
        content: req.body.content,
        label: req.body.label
    });
    var fullUrl = 'http://' + VALUE.DOMAIN_URL;
    blog.contentUrl = fullUrl + '/blog/content/#/?id=' + blog._id;
    blog.save(function (err) {
        if (!!err) {
            utils.respondFailure(res, '操作失败，请重试或者联系管理员');
            return;
        }
        utils.respondSuccess(res);
    });
};

/**
 * 更新博客
 * @body {String} blogId  博客的ID
 * @body {String} title   博客标题
 * @body {String} author  博客作者
 * @body {String} content 博客内容
 */
exports.update = function (req, res) {
    if (!req.body.title || !req.body.author || !req.body.content || !req.body.blogId) {
        utils.respondFailure(res, '请求参数不完整');
        return;
    }
    BlogModel.findById(req.body.blogId, function (err, blog) {
        if (!!err) {
            utils.respondFailure(res, err);
            return;
        }
        if (!blog) {
            utils.respondFailure(res, '博客不存在');
            return;
        }
        if (!!req.body.title) {
            blog.title = req.body.title;
        }
        if (!!req.body.author) {
            blog.author = req.body.author;
        }
        if (!!req.body.content) {
            blog.content = req.body.content;
        }
        blog.save(function (err) {
            if (!!err) {
                utils.respondFailure(res, '操作失败，请重试或者联系管理员');
                return;
            }
            utils.respondSuccess(res);
        });
    });
};

/**
 * 博客详情
 * @query {String} blogId  博客的ID
 */
exports.blogDetail = function (req, res) {
    if (!req.query.blogId) {
        utils.respondFailure(res, '请求参数不完整');
        return;
    }
    BlogModel.findById(req.query.blogId, function (err, blog) {
        if (!!err) {
            utils.respondFailure(res, err);
            return;
        }
        if (!blog) {
            utils.respondFailure(res, '博客不存在');
            return;
        }
        utils.respondSuccess(res, blog);
    });
};

/**
 * 指定标签下的博客列表
 * @query {String} labelId 标签的ID
 * @query {String} limit   取多少条
 * @query {String} offset  从多少条开始截取
 */
exports.pickBlogList = function (req, res) {
    if (!req.query.labelId) {
        utils.respondFailure(res, '请求参数不完整');
        return;
    }
    var offset, limit, options, queryDoc;
    offset = req.body.offset
        ? parseInt(req.body.offset)
        : 0;
    limit = req.body.limit
        ? parseInt(req.body.limit)
        : 20;

    options = {
        offset: offset,
        limit: limit,
        sort: {createdAt: -1},
        populate: {
            path: 'label'
        }
    };
    queryDoc = {
        label: req.query.labelId
    };
    if (!req.user) {
        queryDoc.blogType = VALUE.BLOG_TYPE.NORMAL;
    }
    BlogModel.paginate(queryDoc, options, function (err, result) {
        if (!!err) {
            console.log(err);
            utils.respondFailure(res);
            return;
        }
        utils.respondSuccess(res, {
            list: result.docs,
            total: result.total
        });
    });
};

exports.blogHtml = function (req, res) {
    res.sendFile(path.resolve(__dirname, '../../client/html/blog/blog.client.view.html'));
};

/**
 * 博客主页（登录的人会获取用户自己的博客，如果未登录，则会获取站长的博客
 * 登录的用户会获取自己所有的博客（包括私密博客）
 * 未登录的用户会获取站长的普通博客（除去站长私密博客）
 */
exports.blogMainPage = function (req, res) {
    var userId, isHasUserPermission, labelQueryDoc = {};
    if (!!req.user) {
        userId = req.user._id;
        isHasUserPermission = true;
        labelQueryDoc = {
            user: req.user._id
        };
    } else {
        isHasUserPermission = false;
        userId = VALUE.MASTER_ID;
        labelQueryDoc = {
            labelType: 1,
            user: VALUE.MASTER_ID
        };
    }

    UserModel.findById(userId, '-password -salt -provider', function (err, user) {
        if (!!err) {
            utils.respondFailure(res);
            return;
        }
        LabelModel.find(labelQueryDoc).sort({createdAt: -1}).exec(function (err, labelsList) {
            if (!!err) {
                labelsList = [];
            }
            utils.respondSuccess(res, {
                isHasUserPermission: isHasUserPermission,
                user: {
                    description: user.description,
                    nickname: user.nickname
                },
                labels: labelsList
            });
        });
    });
};