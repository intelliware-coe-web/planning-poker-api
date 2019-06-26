'use strict';
module.exports = (app) => {
  let controller = require('./storyController');

  app.route('/stories/listAll')
    .get(controller.listStories);

  app.route('/stories')
    .get(controller.getStoriesByMeetingId)
    .post(controller.createStory);

  app.route('/stories/:storyId')
    .get(controller.getStory)
    .delete(controller.deleteStory);

  app.route('/stories/:storyId/estimates')
    .get(controller.listStoryEstimates)
    .put(controller.updateStoryEstimate);

  app.route('/stories/:storyId/estimates/:estimateId')
    .delete(controller.deleteStoryEstimate);
};