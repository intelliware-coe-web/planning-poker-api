const _ = require('lodash');
const {spy,stub, assert, match} = require('sinon');

const Estimate = require('../Estimate/estimateModel');
const User = require('../User/userModel');
const Meeting = require('../Meeting/meetingModel');
const Story = require('../Story/storyModel');

const fixture = require('./adminController');

describe('Admin Controller', () => {
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

  describe('delete_all', () => {

    let mockUser, mockStory, mockEstimate, mockMeeting;

    beforeEach(() => {
        mockUser = stub(User, 'deleteMany');
        mockStory = stub(Story, 'deleteMany');
        mockMeeting = stub(Meeting, 'deleteMany');
        mockEstimate = stub(Estimate, 'deleteMany');
    });

    afterEach(() => {
        mockUser.restore();
        mockStory.restore();
        mockMeeting.restore();
        mockEstimate.restore();
    });

    it('should return success message when deleted all', async () => {      
      await fixture.delete_all(req, res);
      assert.called(Estimate.deleteMany)
      assert.called(Story.deleteMany);      
      assert.called(Meeting.deleteMany)
      assert.called(User.deleteMany);           
      send.calledWith('Deleted Everything');
    });

    it('should return error message when there is an error', async () => {
      mockStory.throws(error);

      await fixture.delete_all(req, res);
      assert.called(Estimate.deleteMany)
      assert.called(Story.deleteMany);      
      status.calledWith(500);
      send.calledWith(match(error));
    });
  });
});