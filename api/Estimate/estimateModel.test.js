const expect = require('chai').expect;

const Estimate = require('./estimateModel');

describe('create Estimate', function() {
    it('should be invalid if user is empty', function(done) {
        let estimate = new Estimate();

        estimate.validate(function(err) {
            expect(err.errors.user).to.exist;
            done();
        });
    });
});