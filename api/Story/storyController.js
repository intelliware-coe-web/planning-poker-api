const mongoose = require('mongoose'),
_ = require('underscore'),
Story = mongoose.model('Story');

exports.get_story = async (req, res) => {
  try {
    const story = await Story.findById(req.params.storyId);
    return res.json(story);
  } catch(err) {
    return res.send(err);
  }
}

exports.delete_story = async (req, res) => {
  // find story within meetings then delete
};

// TODO: should we pull this out into something generic?
function sendError(res, err) {
  return res.status(500).send(err);
}
