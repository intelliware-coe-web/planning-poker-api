'use strict';
module.exports = (app) => {
  let controller = require('./storyController');

  app.route('/stories')
    .get(controller.list_stories);

  app.route('/stories/')
    .get(controller.get_stories_by_meetingId)
    .post(controller.create_story);

  app.route('/stories/:storyId')
    .get(controller.get_story)
    .delete(controller.delete_story);

  app.route('/stories/:storyId/estimates')
    .get(controller.list_story_estimates)
    .post(controller.create_story_estimate);

  app.route('/stories/:storyId/estimates/:estimateId')
    .delete(controller.delete_story_estimate);
};