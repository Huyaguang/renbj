'use strict';

exports.SIGNUP_VERIFICATION = 'huaijuan';

exports.UPDATE_PASSWORD_VERIFICATION = 'guangaijuan';

exports.DOMAIN_URL = 'www.huyaguang.com';

exports.BLOG_TYPE = {
    NORMAL: 1,
    TOP: 2,
    PRIVACY: 9
};

if (process.env.NODE_ENV === 'production') {
    exports.MASTER_ID = '58788b23b53e99023ad37b1b';
} else if (process.env.NODE_ENV === 'production') {
    exports.MASTER_ID = '58788dc364a1d01509d83e55';
}