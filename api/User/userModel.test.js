let expect = require('chai').expect;
 
let User = require('./userModel');
 
describe('User Model', function() {
    it('should be invalid if name is empty', function(done) {
        let user = new User();
 
        user.validate(function(err) {
            expect(err.errors.name).to.exist;
            done();
        });
    });
});