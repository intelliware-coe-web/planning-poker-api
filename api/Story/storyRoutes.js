'use strict';
module.exports = (app) => {
  let controller = require('./storyController');

  app.route('/stories')
    .get(controller.list_stories);

  app.route('/stories/:storyId')
    .get(controller.get_story)
    .delete(controller.delete_story);

  app.route('/stories/:storyId/estimate')
    .get(controller.list_story_estimates)
    .put(controller.create_story_estimate);

  app.route('/stories/:storyId/estimate/:estimateId')
    .delete(controller.delete_story_estimate);
}