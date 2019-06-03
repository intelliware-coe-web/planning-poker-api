'use strict';
module.exports = function(app) {
  let controller = require('./meetingController');

  app.route('/meetings')
    .get(controller.list_meetings)
    .post(controller.create_meeting);

  app.route('/meetings/:meetingId')
    .get(controller.get_meeting)
    .delete(controller.delete_meeting);

  app.route('/meetings/:meetingId/attendees')
    .get(controller.list_attendees)
    .post(controller.add_attendee)
    .delete(controller.delete_attendee);
};