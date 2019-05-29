let chai = require('chai');
let chaiHttp = require('chai-http');
let _ = require('lodash');

// // Configure chai
// chai.use(chaiHttp);
// chai.should(); 

let User = require('../models/userModel');
let Meeting = require('../models/meetingModel');

let fixture = require('../controllers/meetingController');
let userMock, meetingMock;

const mockResponse = () => {
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns(res);
    return res;
  };
describe('Add Attendee', function() {
    beforeEach(() => {
        userMock = sinon.mock(User);
        meetingMock = sinon.mock(Meeting);
    });


    fit('should return success message', function(done) {
        let req, res;
        const mockMeetingId = 'mockMeetingId';
        const mockUserId = 'mockId';
        res = mockResponse();
        _.set(req, 'body.id', mockUserId);
        _.set(req, 'params.meetingId', mockMeetingId)                
        
        let mockUserResult = {status: true, user: { _id: mockUserId}};
        userMock.expects('findById').withArgs({_id: mockUserId}).yields(null, mockUserResult);
        
        let mockMeetingResult = {status: true, meeting: {}};
        meetingMock.expects('findOneAndUpdate').yields(null, mockMeetingResult);

        fixture.create_attendee(req, res);
        
        expect(res.message).to.be('Attendee successfully added')   
    });

    
})