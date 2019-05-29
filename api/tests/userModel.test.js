var expect = require('chai').expect;
 
var User = require('../models/userModel');
 
describe('User Model', function() {
    it('should be invalid if name is empty', function(done) {
        var user = new User();
 
        user.validate(function(err) {
            expect(err.errors.name).to.exist;
            done();
        });
    });
});