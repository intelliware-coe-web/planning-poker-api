const mongoose = require('mongoose'),
Meeting = mongoose.model('Meeting'),
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
    return res.json(new_meeting)
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
    await Meeting.remove({_id: req.params.meetingId});
    return res.json({message: 'Meeting successfully deleted'});
  } catch(err) {
    return sendError(res, err);
  }
};

exports.list_attendees = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.meetingId);
    return res.json(meeting.attendees);
  } catch(err) {
    return sendError(res, err);
  }
};

exports.delete_attendee = async (req, res) => {
  const userId = req.body.id;
  if (!userId) {
    return res.json({ message: 'No user id' });    
  } 

  try {
    await Meeting.findOneAndUpdate(
      { _id: req.params.meetingId },
      { $pullAll: {attendees: [userId]}}
    );
    return res.json({message: 'Attendee successfully removed'});
  } catch (err) {
    return sendError(res, err);
  }
};

exports.add_attendee = async function(req, res) {
  const userId = req.body.id;
  if (!userId) {
    return res.json({ message: 'No user id' });    
  } 

  let user;
  try {
    user = await User.findById({_id: userId});
  } catch (err) {
    return res.json({ message: 'No user found with that id' });
  }

  let meeting = await Meeting.findOneAndUpdate({ _id: req.params.meetingId },{ $addToSet: { attendees: user } });
  if (meeting){
    return res.json({ message: 'Attendee successfully added' });
  }  
};

exports.get_current_story = async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.meetingId);
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