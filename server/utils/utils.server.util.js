'use strict';

/**
 * 向客户端发送请求成功的响应
 * @param {String} dataContent 数据内容
 * @param {String} successMsg  成功日志
 */
exports.respondSuccess = function (res, dataContent, successMsg) {
    res.json({
        status: 1,
        msg: successMsg || 'success',
        data: dataContent || {}
    });
};

/**
 * 向客户端发送请求失败的响应
 * @param {String} failureMsg 失败日志
 * @param {Number} errCode    错误码
 */
exports.respondFailure = function (res, failureMsg, errCode) {
    res.json({
        status: errCode || 0,
        msg: failureMsg || '操作失败，请重试或者联系管理员',
        data: {}
    });
};
