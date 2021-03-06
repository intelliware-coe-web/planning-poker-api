'use strict';
module.exports = function(app) {
  let controller = require('./meetingController');

  app.route('/meetings')
    .get(controller.list_meetings)
    .post(controller.create_meeting);

  app.route('/meetings/:meetingId')
    .get(controller.get_meeting)
    .delete(controller.delete_meeting);
    
  app.route('/meetings/:meetingId/currentStory')
      .get(controller.get_current_story)
      .put(controller.update_current_story)
};