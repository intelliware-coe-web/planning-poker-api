'use strict';
module.exports = (app) => {
  let controller = require('./storyController');

  app.route('/meetings/:meetingId/stories')
    .get(controller.get_stories_by_meetingId)
    .post(controller.create_story);

  app.route('/story/:storyId')
    .get(controller.get_story)
    .delete(controller.delete_story);

  app.route('/story')
    .get(controller.list_stories);
};