const storyService = require('./storyService');
const ServiceComposer = require('../serviceComposer');

exports.listStories = async (req, res) => {
    return await ServiceComposer.compose(storyService.list_stories, req, res);
};

exports.createStory = async (req, res) => {
    return await ServiceComposer.compose(storyService.create_story, req, res);
};

exports.getStory = async (req, res) => {
    return await ServiceComposer.compose(storyService.get_story, req, res);
};

exports.getStoriesByMeetingId = async (req, res) => {
    return await ServiceComposer.compose(storyService.get_stories_by_meetingId, req, res);
};

exports.deleteStory = async (req, res) => {
    return await ServiceComposer.compose(storyService.delete_story, req, res);
};

exports.listStoryEstimates = async (req, res) => {
    return await ServiceComposer.compose(storyService.list_story_estimates, req, res);
};

exports.deleteStoryEstimate = async (req, res) => {
    return await ServiceComposer.compose(storyService.delete_story_estimate, req, res);
};

exports.updateStoryEstimate = async (req, res) => {
    return await ServiceComposer.compose(storyService.update_story_estimate, req, res);
};
