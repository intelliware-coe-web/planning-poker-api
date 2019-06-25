const mongoose = require('mongoose'),
    Meeting = mongoose.model('Meeting');

exports.list_meetings = async () => {
    return await Meeting.find();
};

exports.create_meeting = async (req) => {
    return await new Meeting(req.body).save();
};

exports.get_meeting = async (req) => {
    return await Meeting.findById(req.params.meetingId);
};

exports.delete_meeting = async (req) => {
    await Meeting.deleteOne({_id: req.params.meetingId});
    return {message: 'Meeting successfully deleted'};
};

exports.get_current_story = async (req) => {
    const meeting = await Meeting.findById(req.params.meetingId).populate('current_story', 'name description');
    return meeting.current_story;
};

exports.update_current_story = async (req) => {
    await Meeting.updateOne({_id: req.params.meetingId}, {$set: {current_story: req.body.storyId}});
    return {message: 'Meeting successfully updated'};
};