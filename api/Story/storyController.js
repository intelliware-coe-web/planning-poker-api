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

exports.get_story = async (req, res) => {
  try {
      const story = await Story.findById(req.params.storyId);
      return res.json(story);
  } catch(err) {
      return sendError(res, err);
  }
};

exports.list_story_estimates = async (req, res) => {
  try {
    const story = await Story.findById(req.params.storyId);
    if (story == null) {
      return res.json({message: "No story found for that id"});      
    }
    return res.json(story.estimates);
  } catch (err) {
    return sendError(res, err);
  }  
};

exports.delete_story_estimate = async (req, res) => {
  const storyId = req.params.storyId;
  const estimateId = req.params.estimateId;
  try {
    await Story.findOneAndUpdate({ _id: storyId }, { $pullAll: {estimates: [estimateId]}});
    return res.json({message: 'Estimate successfully removed'});
  } catch (err){
    return sendError(res, err);
  }
};

exports.create_story_estimate = async (req, res) => {
  const storyId = req.params.storyId;
  const userId = req.body.userId;
  const estimate = req.body.estimate;

  const previousStoryEstimate = await Story.findOne({'estimates.user': userId});

  try {
    if (previousStoryEstimate) {
      await UpdateExistingEstimate(storyId, userId, estimate);
    }
    await CreateNewEstimate(req.body);

  } catch (err) {
    return sendError(res, err);
  }
};

async function UpdateExistingEstimate(storyId, userId, estimate) {
  await Story.update(
    { _id: storyId, "estimates.user": userId}, 
    { $set: { "estimates.$.estimate": estimate } }
  );
  return res.json({ message: 'Existing estimate successfully updated'});
}

async function CreateNewEstimate(estimateBody, storyId) {
  const new_estimate = new estimate(estimateBody);
  new_estimate = await new_estimate.save();
  await Story.findOneAndUpdate({ _id: storyId },{ $addToSet: { estimates: new_estimate } });
  return res.json({ message: 'Estimate successfully added to story' });
}

// TODO: should we pull this out into something generic?
function sendError(res, err) {
  return res.status(500).send(err);
}


