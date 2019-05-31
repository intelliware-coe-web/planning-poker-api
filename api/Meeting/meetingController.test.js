let _ = require('lodash');
let sinon = require('sinon');

let User = require('../User/userModel');
let Meeting = require('./meetingModel');

let fixture = require('./meetingController');

describe('Meeting Controller', () => {
    let req = {},
    error = new Error({ error: "blah blah" }),
    res = {};

    beforeEach(() => {
        res = {
            json: sinon.spy(),
            send: sinon.spy(),
            status: sinon.stub().returns({ end: sinon.spy() })
        };
    });
    describe('list meetings', () => {
        let expectedResult, mockMeetingFind;
    
        beforeEach(() => {
            mockMeetingFind = sinon.stub(Meeting, 'find');
        });
    
        afterEach(() => {
            mockMeetingFind.restore();
        })
    
        it('should return a list of meetings', async () => {
            expectedResult = [];
            mockMeetingFind.returns(expectedResult);
    
            await fixture.list_meetings(req, res);

            sinon.assert.called(Meeting.find);
            sinon.assert.calledWith(res.json, sinon.match(expectedResult));
            
        });
    
        it('should return error if there is a server error', async () => {
            mockMeetingFind.throws(error);

            await fixture.list_meetings(req, res);

            sinon.assert.calledWith(Meeting.find);
            sinon.assert.calledWith(res.send, sinon.match(error));
        });
    });

    describe('create attendee', () => {
        let mockMeetingFindOneAndUpdate, mockUserFindById;
        
        before(() => {
            mockMeetingFindOneAndUpdate = sinon.stub(Meeting, 'findOneAndUpdate');
            mockUserFindById = sinon.stub(User, 'findById');
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
    
            await fixture.create_attendee(req, res);

            sinon.assert.calledWith(User.findById, {_id: userId});
            sinon.assert.calledWith(Meeting.findOneAndUpdate, { _id: meetingId }, { $addToSet: { attendees: expectedUser } });
            sinon.assert.calledWith(res.json, sinon.match({ message: 'Attendee successfully added' }));            
        });

        it('should return no user id if not in request', async () => {          
            req.body = {};
            await fixture.create_attendee(req, res);

            sinon.assert.calledWith(res.json, sinon.match({ message: 'No user id' }));            
        })

        it('should return no user found if user not found', async () => {
            const userId = '123abc';
            _.set(req, 'body.id', userId);

            mockUserFindById.throws({});
    
            await fixture.create_attendee(req, res);

            sinon.assert.calledWith(User.findById, {_id: userId});
            sinon.assert.calledWith(res.json, sinon.match({ message: 'No user found with that id' }));            
        });
    });
});

