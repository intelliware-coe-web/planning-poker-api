'use strict';
module.exports = function(app) {
  let userList = require('./userController');

  app.route('/users')
    .get(userList.list_users)
    .post(userList.create_user);

  app.route('/users/:userId')
    .get(userList.get_user)
    .delete(userList.delete_user);
};