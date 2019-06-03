const _ = require('lodash');
const {spy,stub, assert, match} = require('sinon');

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

