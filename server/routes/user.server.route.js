'use strict';

var user = require('../controllers/user.server.controller');

/**
 * 用户路由模块
 */
module.exports = function (app) {
    app.route('/register')
        .get(user.signupHtml)
        .post(user.signup);
    app.route('/login')
        .get(user.loginHtml)
        .post(user.signin);
    app.post('/logout', user.signout);

    app.route('/resetpassword')
        .get(user.resetPasswordHtml)
        .put(user.resetPassword);

    app.get('/favicon.ico', user.favicon);

    app.get('/userinfo', user.getUserInfo);
};
