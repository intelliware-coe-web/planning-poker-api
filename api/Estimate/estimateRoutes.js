'use strict';
module.exports = (app) => {
    let controller = require('./estimateController');

    app.route('/estimate')
        .get(controller.list_estimates)
        .put(controller.update_estimate);

    app.route('/estimate/:estimateId')
        .delete(controller.delete_estimate);

    app.route('/stories/:storyId/estimate')
        .get(controller.get_estimates_by_storyId)
};