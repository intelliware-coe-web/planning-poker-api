'use strict';
module.exports = function (app) {
    let controller = require('./userController');

    app.route('/users')
        .get(controller.listUsers)
        .post(controller.createUser);

    app.route('/users/:userId')
        .get(controller.getUser)
        .delete(controller.deleteUser);
};