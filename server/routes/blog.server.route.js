'use strict';

var blog = require('../controllers/blog.server.controller');
var management = require('../utils/management.server.util');

/**
 * 博客路由模块
 */
module.exports = function (app) {
    app.route('/blog')
        .get(blog.blogDetail)
        .put(management.requireUser, blog.update)
        .post(management.requireUser, blog.add);

    app.get('/bloglist', blog.pickBlogList);
    app.get('/myblog', blog.blogHtml);

    app.get('/blogmainpage', blog.blogMainPage);
};
