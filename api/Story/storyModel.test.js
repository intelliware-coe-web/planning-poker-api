const expect = require('chai').expect;
 
const Story = require('./storyModel');
 
describe('Story Model', function() {
    it('should be invalid if name is empty', function(done) {
        let story = new Story();
 
        story.validate(function(err) {
            expect(err.errors.name).to.exist;
            done();
        });
    });
});