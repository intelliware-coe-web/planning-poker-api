const {stub, assert} = require('sinon');
const Meeting = require('../Meeting/meetingModel');
const Story = require('../Story/storyModel');
const User = require('../User/userModel');
const fixture = require('./adminService');

describe('Admin Service', () => {
    let req = {};

    describe('delete_all', () => {
        let mockMeetingDeleteMany, mockStoryDeleteMany, mockUserDeleteMany;

        before(() => {
            mockMeetingDeleteMany = stub(Meeting, 'deleteMany');
            mockStoryDeleteMany = stub(Story, 'deleteMany');
            mockUserDeleteMany = stub(User, 'deleteMany');
        });

        after(() => {
            mockMeetingDeleteMany.restore();
            mockStoryDeleteMany.restore();
            mockUserDeleteMany.restore();
        });

        it('should return success message when deleted all', async () => {
            const expectedResult = {message: 'Deleted Everything'};

            const actualResult = await fixture.delete_all(req);

            assert.called(mockMeetingDeleteMany);
            assert.called(mockStoryDeleteMany);
            assert.called(mockUserDeleteMany);
            assert.match(actualResult, expectedResult);
        });
    });
});