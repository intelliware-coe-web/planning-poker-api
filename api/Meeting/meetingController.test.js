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

    describe('list_attendees', () => {
        let expectedResult, mockMeetingFindById;
    
        beforeEach(() => {
            mockMeetingFindById = stub(Meeting, 'findById');
        });
    
        afterEach(() => {
            mockMeetingFindById.restore();
        });
    
        it('should return list of attendees', async () => {
            _.set(req, 'params.meetingId', 'abc');
            expectedResult = { name: 'Meeting Name', attendees: [] };
            mockMeetingFindById.returns(expectedResult);
    
            await fixture.list_attendees(req, res);

            assert.calledWith(Meeting.findById, 'abc');
            assert.calledWith(res.json, match([]));
            
        });
    
        it('should return error if there is a server error', async () => {
            mockMeetingFindById.throws(error);

            await fixture.list_attendees(req, res);

            assert.called(Meeting.findById);
            assert.calledWith(res.send, match(error));
        });
    });

    describe('add attendee', () => {
        let mockMeetingFindOneAndUpdate, mockUserFindById;
        
        before(() => {
            mockMeetingFindOneAndUpdate = stub(Meeting, 'findOneAndUpdate');
            mockUserFindById = stub(User, 'findById');
        });

        after(() => {
            mockMeetingFindOneAndUpdate.restore();
            mockUserFindById.restore();
        });

        it('should return attendee added messsage', async () => {
            const userId = '123abc';
            const meetingId = 'abc123';

            _.set(req, 'body.id', userId);
            _.set(req, 'params.meetingId', meetingId);

            const expectedUser = {_id: userId};
            const expectedResult = {};
            mockUserFindById.returns(expectedUser);
            mockMeetingFindOneAndUpdate.returns(expectedResult);
    
            await fixture.add_attendee(req, res);

            assert.calledWith(User.findById, {_id: userId});
            assert.calledWith(Meeting.findOneAndUpdate, { _id: meetingId }, { $addToSet: { attendees: expectedUser } });
            assert.calledWith(res.json, match({ message: 'Attendee successfully added' }));            
        });

        it('should return no user id if not in request', async () => {          
            req.body = {};
            await fixture.add_attendee(req, res);

            assert.calledWith(res.json, match({ message: 'No user id' }));            
        });

        it('should return no user found if user not found', async () => {
            const userId = '123abc';
            _.set(req, 'body.id', userId);

            mockUserFindById.throws({});
    
            await fixture.add_attendee(req, res);

            assert.calledWith(User.findById, {_id: userId});
            assert.calledWith(res.json, match({ message: 'No user found with that id' }));            
        });
    });   
});

