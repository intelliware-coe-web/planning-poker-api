const {stub, assert} = require('sinon');
const StoryService = require('./storyService');
const ServiceComposer = require('../serviceComposer');
const fixture = require('./storyController');

describe('Story Controller', () => {
    let req = {}, res = {};
    let mockServiceComposer;

    before(() => {
        mockServiceComposer = stub(ServiceComposer, 'compose');
    });

    after(() => {
        mockServiceComposer.restore();
    });

    describe('listStories', () => {
        let mockListStories;

        before(() => {
            mockListStories = stub(StoryService, 'list_stories');
        });
        after(() => {
            mockListStories.restore();
        });

        it('should call service composer with the list stories service, request, and response', async () => {
            await fixture.listStories(req, res);
            assert.calledWith(mockServiceComposer, mockListStories, req, res);
        });
    });

    describe('createStory', () => {
        let mockCreateStory;

        before(() => {
            mockCreateStory = stub(StoryService, 'create_story');
        });
        after(() => {
            mockCreateStory.restore();
        });

        it('should call service composer with the create story service, request, and response', async () => {
            await fixture.createStory(req, res);
            assert.calledWith(mockServiceComposer, mockCreateStory, req, res);
        });
    });

    describe('getStory', () => {
        let mockGetStory;

        before(() => {
            mockGetStory = stub(StoryService, 'get_story');
        });
        after(() => {
            mockGetStory.restore();
        });

        it('should call service composer with the get story service, request, and response', async () => {
            await fixture.getStory(req, res);
            assert.calledWith(mockServiceComposer, mockGetStory, req, res);
        });
    });

    describe('getStoriesByMeetingId', () => {
        let mockGetStoriesByMeetingId;

        before(() => {
            mockGetStoriesByMeetingId = stub(StoryService, 'get_stories_by_meetingId');
        });
        after(() => {
            mockGetStoriesByMeetingId.restore();
        });

        it('should call service composer with the get story by meeting id service, request, and response', async () => {
            await fixture.getStoriesByMeetingId(req, res);
            assert.calledWith(mockServiceComposer, mockGetStoriesByMeetingId, req, res);
        });
    });

    describe('deleteStory', () => {
        let mockDeleteStory;

        before(() => {
            mockDeleteStory = stub(StoryService, 'delete_story');
        });
        after(() => {
            mockDeleteStory.restore();
        });

        it('should call service composer with the delete story service, request, and response', async () => {
            await fixture.deleteStory(req, res);
            assert.calledWith(mockServiceComposer, mockDeleteStory, req, res);
        });
    });

    describe('listStoryEstimates', () => {
        let mockListStoryEstimates;

        before(() => {
            mockListStoryEstimates = stub(StoryService, 'list_story_estimates');
        });
        after(() => {
            mockListStoryEstimates.restore();
        });

        it('should call service composer with the list story estimates service, request, and response', async () => {
            await fixture.listStoryEstimates(req, res);
            assert.calledWith(mockServiceComposer, mockListStoryEstimates, req, res);
        });
    });

    describe('deleteStoryEstimate', () => {
        let mockDeleteStoryEstimate;

        before(() => {
            mockDeleteStoryEstimate = stub(StoryService, 'delete_story_estimate');
        });
        after(() => {
            mockDeleteStoryEstimate.restore();
        });

        it('should call service composer with the delete story estimate service, request, and response', async () => {
            await fixture.deleteStoryEstimate(req, res);
            assert.calledWith(mockServiceComposer, mockDeleteStoryEstimate, req, res);
        });
    });

    describe('updateStoryEstimate', () => {
        let mockUpdateStoryEstimate;

        before(() => {
            mockUpdateStoryEstimate = stub(StoryService, 'update_story_estimate');
        });
        after(() => {
            mockUpdateStoryEstimate.restore();
        });

        it('should call service composer with the update story estimate service, request, and response', async () => {
            await fixture.updateStoryEstimate(req, res);
            assert.calledWith(mockServiceComposer, mockUpdateStoryEstimate, req, res);
        });
    });
});
