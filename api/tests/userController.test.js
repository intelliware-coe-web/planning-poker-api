var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var User = require('../models/userModel');

var mongoose = require('mongoose');
require('sinon-mongoose');

describe('User controller', function() {

    describe('Get all usesr', function() {
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
    });

});