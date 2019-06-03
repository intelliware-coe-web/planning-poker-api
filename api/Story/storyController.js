const mongoose = require('mongoose'),
Meeting = mongoose.model('Meeting'),
Story = mongoose.model('Story'),
Estimate = mongoose.model('Estimate'),
User = mongoose.model('User');

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
    return sendError(res, err);
  }
};

exports.create_story = async (req, res) => {
  let new_story = new Story(req.body);

  try {
    new_story = await new_story.save();
    await Meeting.findOneAndUpdate({ _id: req.params.meetingId },{ $addToSet: { stories: new_story } });
    return res.json({ message: 'Story successfully added' });
  } catch (err) {
    return sendError(res, err);
  }
};

exports.update_story = async (req, res) => {
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

  let existingEstimate;
  try{
      existingEstimate = await Estimate.findOne({'user': user});
      if(existingEstimate === null) {
          const new_estimate = await (new Estimate({"user": user, "estimate": req.body.estimate}).save());
          await Story.findOneAndUpdate({ _id: req.params.storyId }, { $addToSet: { estimates: new_estimate } })
      } else {
          existingEstimate.estimate = req.body.estimate;
          await Estimate.findOneAndUpdate({ _id: existingEstimate._id }, existingEstimate);
      }
      return res.json({ message: 'Estimate successfully updated' });
  }
  catch(err){
      return sendError(res, err);
  }
};

exports.get_estimate = async (req, res) => {
    try {
        const estimate = await Estimate.findById(req.params.estimateId);
        return res.json(estimate);
    } catch(err) {
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

// TODO: should we pull this out into something generic?
function sendError(res, err) {
  return res.status(500).send(err);
}
