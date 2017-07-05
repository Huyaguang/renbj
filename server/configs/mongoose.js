'use strict';

var config = require('./config');
var mongoose = require('mongoose');

/**
 * mongoose 包装模块
 */
module.exports = function () {
    var db = mongoose.connect(config.db);
    require('../models/user.server.model');
    require('../models/label.server.model');
    require('../models/blog.server.model');
    return db;
};
