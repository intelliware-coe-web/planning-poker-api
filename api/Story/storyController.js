const mongoose = require('mongoose'),
_ = require('underscore'),
Meeting = mongoose.model('Meeting'),
Story = mongoose.model('Story');

exports.get_meeting_stories = async (req, res) => {
  let meeting = await Meeting.findById(req.params.meetingId);

  if (!meeting) {
      return res.json({ message: "No meeting found for that meeting id"})
  }

  try {
    const stories = meeting.stories;
    return res.json(stories);
  } catch (err) {
    return sendError(res, err);
  }  
};

exports.delete_story = async (req, res) => {
  // find story within meetings then delete
};

exports.create_story = async (req, res) => {
  let meeting = await Meeting.findById(req.params.meetingId);

  if (!meeting) {
      return res.json({ message: "No meeting found for that meeting id"})
  }

  let new_story = new Story(req.body);
  meeting.stories.push(new_story);
  try {
    await meeting.save();
    return res.json({ message: 'Story successfully added to meeting'});
  } catch (err) {
    return sendError(res, err);
  }
};

// TODO: should we pull this out into something generic?
function sendError(res, err) {
  return res.status(500).send(err);
}
