const _ = require('lodash');
const {match, stub, assert} = require('sinon');

const Meeting = require('./meetingModel');
const fixture = require('./meetingService');

describe('Meeting Service', () => {
    let req = {}, res = {};
    const meetingId = 'Mock Meeting Id';
    const storyId = 'Mock Story Id';

    describe('list_meetings', () => {
        let mockMeetingFind;

        before(() => {
            mockMeetingFind = stub(Meeting, 'find');
        });

        after(() => {
            mockMeetingFind.restore();
        });

        it('should return a list of meetings', async () => {
            const expectedResult = [];
            mockMeetingFind.returns(expectedResult);

            const actualResult = await fixture.list_meetings(req);

            assert.called(mockMeetingFind);
            assert.match(actualResult, expectedResult);
        });
    });

    describe('create_meeting', () => {
        let mockMeeting;

        before(() => {
            mockMeeting = stub(Meeting.prototype, 'save');
        });

        after(() => {
            mockMeeting.restore();
        });

        it('should return a new meeting', async () => {
            const expectedResult = {name: 'Meeting Name'};
            _.set(req, 'body.name', 'Meeting Name');
            mockMeeting.returns(expectedResult);

            const actualResult = await fixture.create_meeting(req);

            assert.called(mockMeeting);
            assert.match(actualResult, expectedResult);
        });
    });

    describe('get_meeting', () => {
        let mockMeetingFindById;

        before(() => {
            mockMeetingFindById = stub(Meeting, 'findById');
        });

        after(() => {
            mockMeetingFindById.restore();
        });

        it('should return a meeting', async () => {
            const expectedResult = {name: 'Meeting Name'};
            _.set(req, 'params.meetingId', meetingId);

            mockMeetingFindById.returns(expectedResult);

            const actualResult = await fixture.get_meeting(req);

            assert.calledWith(mockMeetingFindById, meetingId);
            assert.match(actualResult, expectedResult);
        });
    });

    describe('delete_meeting', () => {
        let mockMeetingDeleteOne;

        before(() => {
            mockMeetingDeleteOne = stub(Meeting, 'deleteOne');
        });

        after(() => {
            mockMeetingDeleteOne.restore();
        });

        it('should call to delete a meeting and return success message', async () => {
            const expectedResult = {message: 'Meeting successfully deleted'};
            _.set(req, 'params.meetingId', meetingId);

            mockMeetingDeleteOne.returns(expectedResult);

            const actualResult = await fixture.delete_meeting(req);

            assert.calledWith(mockMeetingDeleteOne, match.has('_id', meetingId));
            assert.match(actualResult, expectedResult);
        });
    });

    describe('get_current_story', () => {
        let mockMeetingFindById, mockMeetingFindOneResult;

        before(() => {
            mockMeetingFindById = stub(Meeting, 'findById');
        });

        after(() => {
            mockMeetingFindById.restore();
        });

        it('should call to delete a meeting and return success message', async () => {
            const expectedCurrentStory = {
                _id: storyId,
                name: 'Mock Story Name'
            };
            const meetingWithPopulate = {
                _id: meetingId,
                current_story: expectedCurrentStory
            };
            _.set(req, 'params.meetingId', meetingId);

            mockMeetingFindOneResult = {populate: stub().returns(meetingWithPopulate)};
            mockMeetingFindById.returns(mockMeetingFindOneResult);

            const actualCurrentStory = await fixture.get_current_story(req);

            assert.calledWith(mockMeetingFindById, meetingId);
            assert.match(actualCurrentStory, expectedCurrentStory);
        });
    });

    describe('update_current_story', () => {
        let mockMeetingUpdateOne;

        before(() => {
            mockMeetingUpdateOne = stub(Meeting, 'updateOne');
        });

        after(() => {
            mockMeetingUpdateOne.restore();
        });

        it('should call to delete a meeting and return success message', async () => {
            const expectedResult = {message: 'Meeting successfully updated'};
            _.set(req, 'params.meetingId', meetingId);
            _.set(req, 'body.storyId', storyId);

            mockMeetingUpdateOne.returns({});

            const actualResult = await fixture.update_current_story(req);

            assert.calledWith(mockMeetingUpdateOne, match.has('_id', meetingId), match.has('$set', match.has('current_story', storyId)));
            assert.match(actualResult, expectedResult);
        });
    });
});