const _ = require('lodash');
const {spy,stub, assert, match, mock} = require('sinon');

const User = require('../User/userModel');
const Meeting = require('./meetingModel');

const fixture = require('./meetingController');

describe('Meeting Controller', () => {
    let req = {},
    error = new Error({ error: "blah blah" }),
    res = {}, status, send, json;

    beforeEach(() => {
        json = spy();
        send = spy();
        status = stub();

        res = { json, status, send};

        status.returns(res);
    });

    describe('list meetings', () => {
        let expectedResult, mockMeetingFind;
    
        beforeEach(() => {
            mockMeetingFind = stub(Meeting, 'find');
        });
    
        afterEach(() => {
            mockMeetingFind.restore();
        });
    
        it('should return a list of meetings', async () => {
            expectedResult = [];
            mockMeetingFind.returns(expectedResult);
    
            await fixture.list_meetings(req, res);

            assert.called(Meeting.find);
            assert.calledWith(res.json, match(expectedResult));
            
        });
    
        it('should return error if there is a server error', async () => {
            mockMeetingFind.throws(error);

            await fixture.list_meetings(req, res);

            assert.calledWith(Meeting.find);
            assert.calledWith(res.send, match(error));
        });
    });

    describe('create_meeting', () => {
        let expectedResult, mockMeeting;
    
        beforeEach(() => {
            mockMeeting = stub(Meeting.prototype, 'save');
        });
    
        afterEach(() => {
            Meeting.prototype.save.restore();
        });
    
        it('should return a new meeting', async () => {
            _.set(req, 'body.name', 'Meeting Name');
            expectedResult = { name: 'Meeting Name' };
            mockMeeting.returns(expectedResult);
    
            await fixture.create_meeting(req, res);

            assert.called(Meeting.prototype.save);
            assert.calledWith(res.json, match(expectedResult));
            
        });
    
        it('should return error if there is a server error', async () => {
            mockMeeting.throws(error);

            await fixture.create_meeting(req, res);

            assert.calledWith(Meeting.prototype.save);
            assert.calledWith(res.send, match(error));
        });
    });

    describe('get_meeting', () => {
        let expectedResult, mockMeetingFindById;
    
        beforeEach(() => {
            mockMeetingFindById = stub(Meeting, 'findById');
        });
    
        afterEach(() => {
            mockMeetingFindById.restore();
        });
    
        it('should return a meeting', async () => {
            _.set(req, 'params.meetingId', 'abc');
            expectedResult = { name: 'Meeting Name' };
            mockMeetingFindById.returns(expectedResult);
    
            await fixture.get_meeting(req, res);

            assert.calledWith(Meeting.findById, 'abc');
            assert.calledWith(res.json, match(expectedResult));
            
        });
    
        it('should return error if there is a server error', async () => {
            mockMeetingFindById.throws(error);

            await fixture.get_meeting(req, res);

            assert.called(Meeting.findById);
            assert.calledWith(res.send, match(error));
        });
    });

    describe('delete_meeting', () => {
        let expectedResult, mockMeetingDeleteOne;
    
        beforeEach(() => {
            mockMeetingDeleteOne = stub(Meeting, 'deleteOne');
        });
    
        afterEach(() => {
            mockMeetingDeleteOne.restore();
        });
    
        it('should call delete', async () => {
            _.set(req, 'params.meetingId', 'abc');
            await fixture.delete_meeting(req, res);

            assert.calledWith(Meeting.deleteOne, {_id: 'abc'});
            assert.calledWith(res.json, match({message: 'Meeting successfully deleted'}));
            
        });
    
        it('should return error if there is a server error', async () => {
            mockMeetingDeleteOne.throws(error);

            await fixture.delete_meeting(req, res);

            assert.called(Meeting.deleteOne);
            assert.calledWith(res.send, match(error));
        });
    });

    describe('current story', () => {
        const storyId = '123';
        const meetingId = '456';

        describe('get', () => {
            let expectedResult;
            let mockMeetingFindById, mockMeetingFindOneResult;

            before(() => {
                mockMeetingFindById = stub(Meeting, 'findById');
            });

            after(() => {
                mockMeetingFindById.restore();
            });

            it('should return current story', async () => {
                let expectedCurrentStory = {
                    _id: storyId,
                    name: 'Mock Story Name',
                    description: 'Mock Story Description'
                };
                let meetingWithPopulate = {
                    _id: meetingId,
                    current_story: expectedCurrentStory
                };

                _.set(req, 'params.meetingId', meetingId);

                mockMeetingFindOneResult = { populate: stub().returns(meetingWithPopulate) };
                mockMeetingFindById.returns(mockMeetingFindOneResult);

                await fixture.get_current_story(req, res);

                assert.calledWith(mockMeetingFindById, meetingId);
                assert.calledWith(res.json, expectedCurrentStory);
            });

            it('should return error if there is a server error', async () => {
                mockMeetingFindById.throws(error);
                _.set(req, 'params.meetingId', meetingId);

                await fixture.get_current_story(req, res);

                assert.calledWith(mockMeetingFindById, meetingId);
                status.calledWith(500);
                send.calledWith(match(error));
            });

        });

        describe('update', () => {
            let expectedResult;
            let mockMeetingUpdateOne;

            before(() => {
                mockMeetingUpdateOne = stub(Meeting, 'updateOne');
            });

            after(() => {
                mockMeetingUpdateOne.restore();
            });

            it('should update meeting with current story', async () => {
                expectedResult = { message: 'Meeting successfully updated' };

                _.set(req, 'params.meetingId', meetingId);
                _.set(req, 'body.storyId', storyId);

                mockMeetingUpdateOne.returns({});

                await fixture.update_current_story(req, res);

                assert.calledWith(mockMeetingUpdateOne, {_id: meetingId}, { $set: {current_story: storyId}});
                assert.calledWith(res.json, expectedResult);
            });

            it('should return error if there is a server error', async () => {
                mockMeetingUpdateOne.throws(error);
                _.set(req, 'params.meetingId', meetingId);
                _.set(req, 'body.storyId', storyId);

                await fixture.update_current_story(req, res);

                assert.calledWith(mockMeetingUpdateOne, {_id: meetingId}, { $set: {current_story: storyId}});
                status.calledWith(500);
                send.calledWith(match(error));
            });

        });

    });
});

