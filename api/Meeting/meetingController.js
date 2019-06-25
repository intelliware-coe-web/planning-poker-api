const meetingService = require('./meetingService');
const ServiceComposer = require('../serviceComposer');

exports.listMeetings = async (req, res) => {
    return await ServiceComposer.compose(meetingService.list_meetings, req, res);
};

exports.createMeeting = async (req, res) => {
    return await ServiceComposer.compose(meetingService.create_meeting, req, res);
};

exports.getMeeting = async (req, res) => {
    return await ServiceComposer.compose(meetingService.get_meeting, req, res);
};

exports.deleteMeeting = async (req, res) => {
    return await ServiceComposer.compose(meetingService.delete_meeting, req, res);
};

exports.getCurrentStory = async (req, res) => {
    return await ServiceComposer.compose(meetingService.get_current_story, req, res);
};

exports.updateCurrentStory = async (req, res) => {
    return await ServiceComposer.compose(meetingService.update_current_story, req, res);
};