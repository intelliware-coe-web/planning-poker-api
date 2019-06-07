const mongoose = require('mongoose'),
Meeting = mongoose.model('Meeting'),
Story = mongoose.model('Story'),
User = mongoose.model('User');

exports.list_meetings = async (req, res) => {
  try {
    const meetings = await Meeting.find();
    return res.json(meetings);
  } catch (err) {
    return res.send(err);
  }
};

exports.create_meeting = async (req, res) => {
  try {
    const new_meeting = new Meeting(req.body);
    await new_meeting.save();
    return res.json(new_meeting)
  } catch (err) {
    return res.send(err);
  }
};

exports.get_meeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.meetingId);
    return res.json(meeting);
  } catch(err) {
    return res.send(err);
  }
};

exports.delete_meeting = async (req, res) => {
  try {
    await Meeting.remove({_id: req.params.meetingId});
    return res.json({message: 'Meeting successfully deleted'});
  } catch(err) {
    return res.send(err);
  }
};
