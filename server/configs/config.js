'use strict';

/**
 * 环境配置
 */
var ENV_CONFIG = {
    // 开发环境
    development: {
        db: 'mongodb://localhost/renbjdev',
        sessionSecret: 'my2437',
        port: 8000
    },
    // 测试环境
    test: {
        db: 'mongodb://localhost/renbjtest',
        sessionSecret: 'mytest6394',
        port: 8010
    },
    // 生产环境
    production: {
        db: 'mongodb://localhost/renbjprod',
        sessionSecret: 'my5617',
        port: 8989
    }
};

/**
 * 根据不同的运行环境来加载不同的配置
 */
module.exports = ENV_CONFIG[process.env.NODE_ENV];
