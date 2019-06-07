const expect = require('chai').expect;

const Story = require('./storyModel');
const Meeting = require('../Meeting/meetingModel');

describe('Story Model', function() {
    it('should be invalid if name and meetingId is empty', function(done) {
        let story = new Story();

        story.validate(function(err) {
            expect(err.errors.name).to.exist;
            expect(err.errors.meetingId).to.exist;
            done();
        });
    });

    it('should be invalid if name is empty', function(done) {
        let meeting = new Meeting({name: 'mockmeetingtest'});
        let story = new Story({meetingId: meeting});

        story.validate(function(err) {
            expect(err.errors.name).to.exist;
            expect(err.errors.meetingId).to.not.exist;
            done();
        });
    });

    it('should be invalid if meetingId is empty', function(done) {
        let story = new Story({name: 'MockStoryName'});

        story.validate(function(err) {
            expect(err.errors.name).to.not.exist;
            expect(err.errors.meetingId).to.exist;
            done();
        });
    });

    it('should be valid if name and meetingId are present', function(done) {
        let meeting = new Meeting({name: 'mockmeetingtest2'});
        let story = new Story({name: 'MockStoryName', meetingId: meeting});

        story.validate(function(err) {
            expect(err).to.null;
            done();
        });
    });
});