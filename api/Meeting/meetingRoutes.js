'use strict';
module.exports = function(app) {
  let meetingList = require('./meetingController');

  app.route('/meetings')
    .get(meetingList.list_meetings)
    .post(meetingList.create_meeting);

  app.route('/meetings/:meetingId')
    .get(meetingList.get_meeting)
    .delete(meetingList.delete_meeting);

  app.route('/meetings/:meetingId/attendees')
    .get(meetingList.list_attendees)
    .post(meetingList.create_attendee)
    .delete(meetingList.delete_attendee);

  app.route('/meetings/:meetingId/stories')
    .get(meetingList.list_stories)
    .post(meetingList.create_story)
    .delete(meetingList.delete_story);

};