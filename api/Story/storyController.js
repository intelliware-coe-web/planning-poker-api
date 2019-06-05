const mongoose = require('mongoose'),
Meeting = mongoose.model('Meeting'),
Story = mongoose.model('Story');

exports.list_stories = async (req, res) => {
  try {
    const stories = await Story.find();
    return res.json(stories);
  } catch (err) {
    return sendError(res, err);
  }  
};

exports.get_story = async (req, res) => {
  try {
      const story = await Story.findById(req.params.storyId);
      return res.json(story);
  } catch(err) {
      return sendError(res, err);
  }
};

exports.get_stories_by_meetingId = async (req, res) => {
  try {
      const stories = await Story.find({meeting: { _id: req.params.meetingId } });
      return res.json(stories);
  } catch (err) {
      return sendError(res, err);
  }
};

exports.delete_story = async (req, res) => {
  const storyId = req.params.storyId;
  try {
    await Story.deleteOne({_id: storyId});
    return res.json({message: 'Story successfully removed'});
  } catch (err){
    return sendError(res, err);
  }
};

exports.create_story = async (req, res) => {
  const meetingId = req.params.meetingId;

  if (!meetingId) {
      return res.json({ message: 'No meeting id provided' });
  }

  let meeting = await Meeting.findById(meetingId);

  if (!meeting) {
      return res.json({ message: "No meeting found for that meeting id"})
  }
  req.body.meeting = meeting;

  let new_story = new Story(req.body);

  try {
    new_story = await new_story.save();
    return res.json({ message: 'Story successfully created'});
  } catch (err) {
    return sendError(res, err);
  }
};

// TODO: should we pull this out into something generic?
function sendError(res, err) {
  return res.status(500).send(err);
}
