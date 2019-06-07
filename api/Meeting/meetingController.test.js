const _ = require('lodash');
const {spy,stub, assert, match, mock} = require('sinon');

const User = require('../User/userModel');
const Meeting = require('./meetingModel');

const fixture = require('./meetingController');

describe('Meeting Controller', () => {
    let req = {},
    error = new Error({ error: "blah blah" }),
    res = {};

    beforeEach(() => {
        res = {
            json: spy(),
            send: spy(),
            status: stub().returns(res)
        };
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
        let expectedResult, mockMeetingRemove;
    
        beforeEach(() => {
            mockMeetingRemove = stub(Meeting, 'remove');
        });
    
        afterEach(() => {
            mockMeetingRemove.restore();
        });
    
        it('should call delete', async () => {
            _.set(req, 'params.meetingId', 'abc');
            await fixture.delete_meeting(req, res);

            assert.calledWith(Meeting.remove, {_id: 'abc'});
            assert.calledWith(res.json, match({message: 'Meeting successfully deleted'}));
            
        });
    
        it('should return error if there is a server error', async () => {
            mockMeetingRemove.throws(error);

            await fixture.delete_meeting(req, res);

            assert.called(Meeting.remove);
            assert.calledWith(res.send, match(error));
        });
    });
    
});

