'use strict';

var mongoose = require('mongoose');

var LabelModel = mongoose.model('Label');

var utils = require('../utils/utils.server.util');

/**
 * 添加标签
 * @body {String} title       标签标题
 * @body {String} description 标题描述
 */
exports.add = function (req, res) {
    if (!req.body.title || !req.body.description) {
        utils.respondFailure(res, '请输入完整的标签信息');
        return;
    }
    var label = new LabelModel({
        user: req.user._id,
        title: req.body.title,
        description: req.body.description
    });
    label.save(function (err) {
        if (!!err) {
            utils.respondFailure(res);
            return;
        }
        utils.respondSuccess(res);
    });
};

/**
 * 更新标签信息
 * @body {String} labelId     标签ID
 * @body {String} title       标签标题
 * @body {String} description 标签描述
 */
exports.update = function (req, res) {
    if (!req.body.title || !req.body.description || !req.body.labelId) {
        utils.respondFailure(res, '请输入完整的标签信息');
        return;
    }
    LabelModel.findById(req.body.labelId, function (err, label) {
        if (!!err) {
            utils.respondFailure(res);
            return;
        }
        if (!label) {
            utils.respondFailure(res, '您所更改的标签不存在');
            return;
        }
        label.title = req.body.title;
        label.description = req.body.description;
        label.save(function (err) {
            if (!!err) {
                utils.respondFailure(res);
                return;
            }
            utils.respondSuccess(res);
        });
    });
};

/**
 * 获取标签列表
 * @query {String} limit   取多少条
 * @query {String} offset  从多少条开始截取
 */
exports.pickLabelList = function (req, res) {
    var offset, limit, options;
    offset = req.body.offset
        ? parseInt(req.body.offset)
        : 0;
    limit = req.body.limit
        ? parseInt(req.body.limit)
        : 20;

    options = {
        offset: offset,
        limit: limit,
        sort: {createdAt: -1}
    };
    LabelModel.paginate({}, options, function (err, result) {
        if (!!err) {
            utils.respondFailure(res);
            return;
        }
        utils.respondSuccess(res, {
            list: result.docs,
            total: result.total
        });
    });
};
