'use strict';
module.exports = function(app) {
  var meetingList = require('../controllers/meetingController');

  app.route('/meetings')
    .get(meetingList.list_meetings)
    .post(meetingList.create_meeting);

  app.route('/meetings/:meetingId')
    .get(meetingList.get_meeting)
    .delete(meetingList.delete_meeting);
};