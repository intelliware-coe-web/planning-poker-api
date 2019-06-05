'use strict';
module.exports = (app) => {
  let controller = require('./storyController');

  app.route('/meetings/:meetingId/stories')
    .get(controller.get_meeting_stories)
    .post(controller.create_story);

  app.route('/story/:storyId')
    .delete(controller.delete_story);
};