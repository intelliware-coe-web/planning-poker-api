'use strict';
module.exports = function(app) {
  let controller = require('./userController');

  app.route('/users')
    .get(controller.list_users)
    .post(controller.create_user);

  app.route('/users/:userId')
    .get(controller.get_user)
    .delete(controller.delete_user);
};