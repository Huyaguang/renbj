'use strict';

var label = require('../controllers/label.server.controller');
var management = require('../utils/management.server.util');

/**
 * 标签路由模块
 */
module.exports = function (app) {
    app.route('/label')
        .put(management.requireUser, label.update)
        .post(management.requireUser, label.add);

    app.get('/labellist', label.pickLabelList);
};
