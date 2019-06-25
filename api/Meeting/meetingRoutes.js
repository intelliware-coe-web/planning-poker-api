'use strict';
module.exports = function (app) {
    let controller = require('./meetingController');

    app.route('/meetings')
        .get(controller.listMeetings)
        .post(controller.createMeeting);

    app.route('/meetings/:meetingId')
        .get(controller.getMeeting)
        .delete(controller.deleteMeeting);

    app.route('/meetings/:meetingId/currentStory')
        .get(controller.getCurrentStory)
        .put(controller.updateCurrentStory);

};