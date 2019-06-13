const mongoose = require('mongoose'),
Story = mongoose.model('Story');

exports.list_stories = async (req, res) => {
  try {
    const stories = await Story.find();
    return res.json(stories);
  } catch (err) {
    return sendError(res, err);
  }  
};

exports.create_story = async (req, res) => {
  try {
    let new_story = new Story({ 
      name: req.body.name, 
      description: req.body.description, 
      meetingId: req.query.meetingId
    });
    await new_story.validate();
    await new_story.save();

    return res.json({ message: 'Story successfully created' });
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
      const stories = await Story.find({meetingId: req.query.meetingId});
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

exports.list_story_estimates = async (req, res) => {
  try {
    const story = await Story.findById(req.params.storyId).populate('estimates.user', 'name');
    if (story == null) {
      return res.json({message: "No story found for that id"});      
    }
    return res.json(story.estimates);
  } catch (err) {
    return sendError(res, err);
  }  
};

exports.delete_story_estimate = async (req, res) => {
  try {
    await Story.updateOne({ _id: req.params.storyId }, { $pull: {estimates: {_id: req.params.estimateId}}});
    return res.json({message: 'Estimate successfully removed'});
  } catch (err){
    return sendError(res, err);
  }
};

exports.update_story_estimate = async (req, res) => {
  try {
    const storyId = req.params.storyId;
    const userId = req.body.userId;
    const estimateVal = req.body.estimate;
    
    const previousStoryEstimate = await Story.findOne(
      { _id: storyId, 'estimates.user': userId }
    );

    if (previousStoryEstimate) {
      await updateExistingUserEstimate(userId, storyId, estimateVal);
      return res.json({ message: 'Existing estimate successfully updated'});
    }

    await addNewUserEstimate(userId, storyId, estimateVal);
    return res.json({ message: 'Estimate successfully added to story' });
  } catch (err) {
    return sendError(res, err);
  }
};

async function updateExistingUserEstimate(userId, storyId, estimateVal) {
  await Story.update(
    { _id: storyId, "estimates.user": userId}, 
    { $set: { "estimates.$.estimate": estimateVal }}
  );  

  await updateStoryEstimateAverage(storyId);
}

async function addNewUserEstimate(userId, storyId, estimateVal) {
  await Story.findOneAndUpdate(
    { _id: storyId },
    { $addToSet: { estimates: {userId: userId, estimate: estimateVal} } }
  );

  await updateStoryEstimateAverage(storyId);
}

async function updateStoryEstimateAverage(storyId) {
  const newAvg = await calculateStoryEstimateAverage(storyId);

  await Story.update(
    { _id: storyId }, { $set: { estimate_avg: newAvg }}
  ); 
}

async function calculateStoryEstimateAverage(storyId) {
  const story = await Story.findOne({_id: storyId});

  let total = 0;
  const estimateCount = story.estimates.length;

  story.estimates.forEach(currEstimate => {
    total += currEstimate.estimate;
  });

  return total / estimateCount;
}

// TODO: should we pull this out into something generic?
function sendError(res, err) {
  return res.status(500).send(err);
}


