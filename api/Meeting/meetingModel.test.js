let expect = require('chai').expect;
 
let Meeting = require('./meetingModel');
 
describe('create Meeting', function() {
    it('should be invalid if name is empty', function(done) {
        let meeting = new Meeting();
 
        meeting.validate(function(err) {
            expect(err.errors.name).to.exist;
            done();
        });
    });
});