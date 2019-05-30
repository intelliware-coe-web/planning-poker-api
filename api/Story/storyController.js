const mongoose = require('mongoose'),
Meeting = mongoose.model('Meeting'),
Story = mongoose.model('Story');

exports.list_stories = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.meetingId);
    if (meeting == null) {
      return res.json({message: "No meeting found for that id"});      
    }
    return res.json(meeting.stories);
  } catch (err) {
    return sendError(res, err);
  }  
};

exports.delete_story = async (req, res) => {
  const storyId = req.body.id;
  try {
    await Meeting.findOneAndUpdate({ _id: req.params.meetingId }, { $pullAll: {stories: [storyId]}});
    await Story.remove({_id: storyId});
    return res.json({message: 'Story successfully removed'});
  } catch (err){
    return res.send(err);
  }
}

exports.create_story = async (req, res) => {
  let new_story = new Story(req.body);

  try {
    new_story = await new_story.save();
    Meeting.findOneAndUpdate({ _id: req.params.meetingId },{ $addToSet: { stories: new_story } });
    return res.json({message: 'Story successfully added'});
  } catch (err) {
    return res.send(err);
  }
};

// TODO: should we pull this out into something generic?
function sendError(res, err) {
  return res.send(err);
}
