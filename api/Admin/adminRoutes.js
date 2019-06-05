'use strict';
module.exports = (app) => {
    let controller = require('./adminController');

    app.route('/admin/delete/all').get(controller.delete_all);
};