'use strict';

var app = require('../../server');
var should = require('chai').should();
var request = require('supertest');
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');

var VALUE = require('../utils/value.server.util');

describe('Testing user controller', function () {
    var agent, oldPassword, newPassword, phone;
    agent = request.agent(app);
    phone = '123456789';
    oldPassword = '123456';
    newPassword = '123459';

    // before and after
    before(function (done) {
        done();
    });
    after(function (done) {
        UserModel.remove(done);
    });

    // test case
    it('Should be able to register a user', function (done) {
        agent
            .post('/register')
            .send({
                phone: phone,
                password: oldPassword,
                nickname: 'abc',
                verification: VALUE.SIGNUP_VERIFICATION
            })
            .expect(200)
            .end(function (err, res) {
                if (!!err) {
                    done(err);
                    return;
                }
                res.body.status.should.equal(1);
                done();
            });
    });
    it('Should be able to logout', function (done) {
        agent
            .post('/logout')
            .expect(200)
            .end(function (err, res) {
                if (!!err) {
                    done(err);
                    return;
                }
                res.body.status.should.equal(1);
                done();
            });
    });
    it('Should be able to login', function (done) {
        agent
            .post('/login')
            .send({
                phone: phone,
                password: oldPassword
            })
            .expect(200)
            .end(function (err, res) {
                if (!!err) {
                    done(err);
                    return;
                }
                res.body.status.should.equal(1);
                done();
            });
    });
    it('Should be able to resetpassword', function (done) {
        agent
            .put('/resetpassword')
            .send({
                phone: phone,
                newPassword: newPassword,
                newPasswordAgain: newPassword,
                verification: VALUE.UPDATE_PASSWORD_VERIFICATION
            })
            .expect(200)
            .end(function (err, res) {
                if (!!err) {
                    done(err);
                    return;
                }
                res.body.status.should.equal(1);
                done();
            });
    });
    it('Should be able to logout', function (done) {
        agent
            .post('/logout')
            .expect(200, done);
    });
    it('Should be able to login', function (done) {
        agent
            .post('/login')
            .send({
                phone: phone,
                password: newPassword
            })
            .expect(200)
            .end(function (err, res) {
                if (!!err) {
                    done(err);
                    return;
                }
                res.body.status.should.equal(1);
                done();
            });
    });
});
