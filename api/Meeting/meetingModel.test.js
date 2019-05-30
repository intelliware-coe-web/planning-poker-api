var expect = require('chai').expect;
 
var Meeting = require('../models/meetingModel');
 
describe('create Meeting', function() {
    it('should be invalid if name is empty', function(done) {
        var meeting = new Meeting();
 
        meeting.validate(function(err) {
            expect(err.errors.name).to.exist;
            done();
        });
    });
});