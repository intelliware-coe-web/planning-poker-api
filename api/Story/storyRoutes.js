'use strict';
module.exports = (app) => {
  let controller = require('./storyController');

  app.route('/meetings/:meetingId/stories')
    .get(controller.list_stories)
    .post(controller.create_story)
    .delete(controller.delete_story);

  app.route('/story/:storyId/estimate')
      .put(controller.update_story);

  app.route('/estimate/:estimateId')
      .get(controller.get_estimate);

  app.route('/story/:storyId')
      .get(controller.get_story)
};