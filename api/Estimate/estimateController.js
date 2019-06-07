const mongoose = require('mongoose'),
    Estimate = mongoose.model('Estimate'),
    User = mongoose.model('User'),
    Story = mongoose.model('Story');

exports.update_estimate = async (req, res) => {
    try {
        const userId = req.body.userId;
        if (!userId) {
            return res.json({ message: 'No userId' });
        }
        let user = await User.findById({_id: userId});

        const storyId = req.body.storyId;
        if (!storyId) {
            return res.json({ message: 'No storyId' });
        }
        let story = await Story.findById({_id: storyId});

        let estimate = req.body.estimate;
        if (!estimate) {
            return res.json({ message: 'No estimate given' });
        }

        await UpdateEstimate(user, story, estimate);
        return res.json({message: 'Estimate updated.'});
    } catch(err) {
        sendError(res, err);
    }

};

async function UpdateEstimate(user, story, estimate) {
    let new_estimate = new Estimate({user: user, story: story, estimate: estimate});
    var upsertData = new_estimate.toObject();
    delete upsertData._id;
    return await Estimate.findOneAndUpdate({user: user, story: story}, upsertData, {upsert: true});
}

exports.list_estimates = async (req, res) => {
    try {
        const estimates = await Estimate.find();
        return res.json(estimates);
    } catch (err) {
        return sendError(res, err);
    }
};

exports.get_estimates_by_storyId = async (req, res) => {
    try {
        const estimates = await Estimate.find({story: { _id: req.params.storyId } });
        return res.json(estimates);
    } catch (err) {
        return sendError(res, err);
    }
};

exports.delete_estimate = async (req, res) => {
    try {
        await Estimate.deleteOne({_id: req.params.estimateId});
        return res.json({message: 'Estimate successfully deleted'});
    } catch(err) {
        return sendError(res, err);
    }
};

// TODO: should we pull this out into something generic?
function sendError(res, err) {
    return res.status(500).send(err);
}
