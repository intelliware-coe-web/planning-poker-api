var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var User = require('../models/userModel');

var mongoose = require('mongoose');
require('sinon-mongoose');

describe('User controller', function() {

    describe('List all users', function() {
        it('should return all users', function(done) {
            var userMock = sinon.mock(User);
            var expectedResult = {status: true, users: []};
            userMock.expects('find').yields(null, expectedResult);
            User.find(function (err, result) {
                userMock.verify();
                userMock.restore();
                expect(result.status).to.be.true;
                done();
            });
        });

        it('should return error', function(done) {
            var userMock = sinon.mock(User);
            var expectedResult = {status: false, error: "Something went wrong"};
            userMock.expects('find').yields(expectedResult, null);
            User.find(function (err, result) {
                userMock.verify();
                userMock.restore();
                expect(err.status).to.not.be.true;
                done();
            });
        });
    });

    describe('Create a new user', function() {
        it('should create new user', function(done) {
            var userMock = sinon.mock(new User({
                name: 'Test User'
            }));
            var user = userMock.object;
            var expectedResult = {status: true};
            userMock.expects('save').yields(null, expectedResult);
            user.save(function (err, result) {
                userMock.verify();
                userMock.restore();
                expect(result.status).to.be.true;
                done();
            });
        });

        it('should return error, if create not saved', function(done) {
            var userMock = sinon.mock(new User({
                name: 'Test User'
            }));
            var user = userMock.object;
            var expectedResult = {status: false};
            userMock.expects('save').yields(expectedResult, null);
            user.save(function (err, result) {
                userMock.verify();
                userMock.restore();
                expect(err.status).to.not.be.true;
                done();
            });
        });
    });

    describe('Get a user by id', function() {
        it('should return a user', function(done) {
            var userMock = sinon.mock(User);
            var expectedResult = {status: true, user: { _id: 12345, name: 'Test user', Created_date: Date.now }};
            userMock.expects('findById').withArgs({_id:12345}).yields(null, expectedResult);
            User.findById({_id:12345}, function (err, result) {
                userMock.verify();
                userMock.restore();
                expect(result.status).to.be.true;
                done();
            });
        });

        it('should return error', function(done) {
            var userMock = sinon.mock(User);
            var expectedResult = {status: false, error: "Something went wrong"};
            userMock.expects('findById').withArgs({_id:12345}).yields(expectedResult, null);
            User.findById({_id:12345}, function (err, result) {
                userMock.verify();
                userMock.restore();
                expect(err.status).to.not.be.true;
                done();
            });
        });
    });

    describe('Delete a user by id', function() {
        it('should delete a user', function(done) {
            var userMock = sinon.mock(User);
            var expectedResult = {status: true};
            userMock.expects('remove').withArgs({_id:12345}).yields(null, expectedResult);
            User.remove({_id:12345}, function (err, result) {
                userMock.verify();
                userMock.restore();
                expect(result.status).to.be.true;
                done();
            });
        });

        it('should return error', function(done) {
            var userMock = sinon.mock(User);
            var expectedResult = {status: false};
            userMock.expects('remove').withArgs({_id:12345}).yields(expectedResult, null);
            User.remove({_id:12345}, function (err, result) {
                userMock.verify();
                userMock.restore();
                expect(err.status).to.not.be.true;
                done();
            });
        });
    });

});