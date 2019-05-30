'use strict';
module.exports = (app) => {
  let controller = require('./storyController');

  app.route('/meetings/:meetingId/stories')
    .get(controller.list_stories)
    .post(controller.create_story)
    .delete(controller.delete_story);
};