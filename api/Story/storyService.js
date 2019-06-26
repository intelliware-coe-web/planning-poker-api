const mongoose = require('mongoose'),
    Story = mongoose.model('Story');

exports.list_stories = async () => {
    return await Story.find();
};

exports.create_story = async (req) => {
    let new_story = new Story({
        name: req.body.name,
        description: req.body.description,
        meetingId: req.query.meetingId
    });
    await new_story.validate();
    await new_story.save();

    return {message: 'Story successfully created'};
};

exports.get_story = async (req) => {
    return await Story.findById(req.params.storyId);
};

exports.get_stories_by_meetingId = async (req) => {
    return await Story.find({meetingId: req.query.meetingId});
};

exports.delete_story = async (req) => {
    await Story.deleteOne({_id: req.params.storyId});
    return {message: 'Story successfully removed'};
};

// TODO: Do we want to return an error if the story does not exist rather than sending message
exports.list_story_estimates = async (req) => {
    const story = await Story.findById(req.params.storyId).populate('estimates.user', 'name');
    if (story == null) {
        return {message: 'No story found for that id'};
    }
    return story.estimates;
};

exports.delete_story_estimate = async (req) => {
    await Story.updateOne({_id: req.params.storyId}, {$pull: {estimates: {_id: req.params.estimateId}}});
    return {message: 'Estimate successfully removed'};
};

// TODO: Can this be refactored?
exports.update_story_estimate = async (req) => {
    const storyId = req.params.storyId;

    const storyUpdate = await Story.updateOne(
        {_id: req.params.storyId, 'estimates.user': req.body.user},
        {$set: {'estimates.$.estimate': req.body.estimate}}
    );

    if (!storyUpdate.n) {
        await Story.updateOne({_id: req.params.storyId}, {$addToSet: {estimates: req.body}});
        await updateStoryEstimateAverage(storyId);
        return {message: 'Estimate successfully added to story'};
    }

    await updateStoryEstimateAverage(storyId);
    return {message: 'Existing estimate successfully updated'};
};

async function updateStoryEstimateAverage(storyId) {
    const newAvg = await calculateStoryEstimateAverage(storyId);

    await Story.updateOne({_id: storyId}, {$set: {estimate_avg: newAvg}});
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