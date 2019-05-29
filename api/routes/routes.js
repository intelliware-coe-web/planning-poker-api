'use strict';
module.exports = function(app) {
  var userList = require('../controllers/userController');
  var meetingList = require('../controllers/meetingController');

  app.route('/users')
    .get(userList.list_users)
    .post(userList.create_user);

  app.route('/users/:userId')
    .get(userList.get_user)
    .delete(userList.delete_user);

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

  app.route('/meetings/:meetingId/tickets')
    .get(meetingList.list_tickets)
    .post(meetingList.create_ticket)
    .delete(meetingList.delete_ticket);
  
};