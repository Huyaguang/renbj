'use strict';

var index = require('../controllers/index.server.controller');

/**
 * 首页路由模块
 */
module.exports = function (app) {
    app.get('/', index.websiteHtml);
};
