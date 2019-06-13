const mongoose = require('mongoose'),
Meeting = mongoose.model('Meeting'),
Story = mongoose.model('Story'),
User = mongoose.model('User');

exports.list_meetings = async (req, res) => {
  try {
    const meetings = await Meeting.find();
    return res.json(meetings);
  } catch (err) {
    return sendError(res, err);
  }
};

exports.create_meeting = async (req, res) => {
  try {
    const new_meeting = new Meeting(req.body);
    await new_meeting.save();
    return res.json(new_meeting);
  } catch (err) {
    return sendError(res, err);
  }
};

exports.get_meeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.meetingId);
    return res.json(meeting);
  } catch(err) {
    return sendError(res, err);
  }
};

exports.delete_meeting = async (req, res) => {
  try {
    await Meeting.deleteOne({_id: req.params.meetingId});
    return res.json({message: 'Meeting successfully deleted'});
  } catch(err) {
    return sendError(res, err);
  }
};

exports.get_current_story = async (req, res) => {
    try {
        let meeting = await Meeting.findById(req.params.meetingId).populate('current_story', 'name description');
        return res.json(meeting.current_story);
    } catch(err) {
        return sendError(res, err);
    }
};

exports.update_current_story = async (req, res) => {
    try {
        await Meeting.updateOne({_id: req.params.meetingId}, { $set: {current_story: req.body.storyId}});
        return res.json({ message: 'Meeting successfully updated' });
    } catch(err) {
        return sendError(res, err);
    }
};

// TODO: should we pull this out into something generic?
function sendError(res, err) {
    return res.status(500).send(err);
}
