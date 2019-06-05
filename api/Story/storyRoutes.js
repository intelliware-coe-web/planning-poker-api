'use strict';
module.exports = (app) => {
  let controller = require('./storyController');

  app.route('/story/:storyId')
    .get(controller.get_story)
    .delete(controller.delete_story);
};