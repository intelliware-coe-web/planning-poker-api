const _ = require('lodash');
const {spy,stub, assert, match} = require('sinon');

const Story = require('./storyModel');
const Meeting = require('../Meeting/meetingModel');
const fixture = require('./storyController');

describe('Story Controller', () => {
    let req = {},
        error = new Error({ error: "blah blah" }),
        res = {}, status, send, json;

    const storyId = '123';

    beforeEach(() => {
        json = spy();
        send = spy();
        status = stub();

        res = { json, status, send};

        status.returns(res);
    });

    describe('list all stories', () => {
        let expectedResult, mockStoryFind;

        beforeEach(() => {
            mockStoryFind = stub(Story, 'find');
        });

        afterEach(() => {
            mockStoryFind.restore();
        });

        it('should return an array of stories', async () => {
            expectedResult = [];

            mockStoryFind.returns(expectedResult);

            await fixture.list_stories(req, res);

            assert.calledWith(Story.find);
            json.calledWith(match(expectedResult));            
        });
        
        it('should return error if there is a server error', async () => {
            mockStoryFind.throws(error);
            
            await fixture.list_stories(req, res);
            
            assert.calledWith(Story.find);
            status.calledWith(500);
            send.calledWith(match(error));
        });
    });

    describe('get story by id', () => {
        let expectedResult, mockStoryFindById;

        beforeEach(() => {
            mockStoryFindById = stub(Story, 'findById');
        });

        afterEach(() => {
            mockStoryFindById.restore();
        });

        it('should return a story', async () => {
            expectedResult = {_id: storyId};

            mockStoryFindById.returns(expectedResult);

            _.set(req, 'params.storyId', storyId);

            await fixture.get_story(req, res);

            assert.calledWith(Story.findById, storyId);
            json.calledWith(match(expectedResult));            
        });
        
        it('should return error if there is a server error', async () => {
            mockStoryFindById.throws(error);
            
            await fixture.get_story(req, res);
            
            assert.calledWith(Story.findById, storyId);
            status.calledWith(500);
            send.calledWith(match(error));
        });
    });

    describe('get stories by meeting id', () => {
        let expectedResponse;
        let mockStoryFind;
        const meetingId = '123';

        beforeEach(() => {
            mockStoryFind = stub(Story, 'find');
        });

        afterEach(() => {
            mockStoryFind.restore();
        });

        it('should return story list for given meeting id', async () => {
            expectedResponse = [ {_id: 'id1', name: 'story a', meetingId: '123'},
                                 {_id: 'id2', name: 'story b', meetingId: '123'} ];

            _.set(req, 'query.meetingId', meetingId);

            mockStoryFind.returns(expectedResponse);

            await fixture.get_stories_by_meetingId(req, res);

            assert.calledWith(mockStoryFind, {meetingId: meetingId });
            assert.calledWith(res.json, expectedResponse);
        });


        it('should return error if there is a server error', async () => {
            mockStoryFind.throws(error);

            _.set(req, 'query.meetingId', meetingId);
            await fixture.get_stories_by_meetingId(req, res);

            assert.calledWith(mockStoryFind, {meetingId: meetingId});
            status.calledWith(500);
            send.calledWith(match(error));
        });
    });

    describe('create story', () => {
        let mockStorySave, mockStoryValidate;

        beforeEach(() => {
            mockStorySave = stub(Story.prototype, 'save');
            mockStoryValidate = stub(Story.prototype, 'validate');
        });

        afterEach(() => {
            mockStorySave.restore();
            mockStoryValidate.restore();
        });

        it('should create story given meeting id', async () => {
            const successMessage = {message: 'Story successfully created'};
            const meetingId = 123456;

            _.set(req, 'body', {name: 'story a'});
            _.set(req, 'query.meetingId', meetingId);

            await fixture.create_story(req, res);

            mockStoryValidate.returns({});

            assert.calledWith(mockStorySave);
            assert.calledWith(res.json, successMessage);
        });

        it('should fail validation given non existent meeting id', async () => {
            const meetingId = null;

            _.set(req, 'body', {name: 'story a'});
            _.set(req, 'query.meetingId', meetingId);

            await fixture.create_story(req, res);

            mockStoryValidate.throws(error);

            status.calledWith(500);
            send.calledWith(match(error));
        });
    });

    describe('delete story', () => {
        let expectedResponse;
        let mockStoryDeleteOne;
        const storyId = '123';

        beforeEach(() => {
            mockStoryDeleteOne = stub(Story, 'deleteOne');
        });

        afterEach(() => {
            mockStoryDeleteOne.restore();
        });

        it('should delete a story ', async () => {
            expectedResponse = {message: 'Story successfully removed'};

            mockStoryDeleteOne.returns({});

            _.set(req, 'params.storyId', storyId);

            await fixture.delete_story(req, res);

            assert.calledWith(mockStoryDeleteOne, {_id: storyId});
            assert.calledWith(res.json, expectedResponse);
        });


        it('should return error if there is a server error', async () => {
            mockStoryDeleteOne.throws(error);
            _.set(req, 'params.storyId', storyId);

            await fixture.delete_story(req, res);

            assert.calledWith(mockStoryDeleteOne, {_id: storyId});
            status.calledWith(500);
            send.calledWith(match(error));
        });
    });

    describe('list story estimates', () => {
        let expectedResponse;
        let mockStoryFindById;
        const storyId = 'story1';

        beforeEach(() => {
            mockStoryFindById = stub(Story, 'findById');
        });

        afterEach(() => {
            mockStoryFindById.restore();
        });

        it('should list estimates of the story ', async () => {
            _.set(req, 'params.storyId', storyId);

            expectedResponse = [];
            expectedStory = {
                _id: storyId, 
                name: 'story a', 
                meeting: {
                    _id: '123'
                },
                estimates: expectedResponse
            };
            mockStoryFindById.returns(expectedStory);

            await fixture.list_story_estimates(req, res);

            assert.calledWith(mockStoryFindById, storyId);
            assert.calledWith(res.json, expectedResponse);
        });


        it('should return error if there is a server error', async () => {
            _.set(req, 'params.storyId', storyId);
            mockStoryFindById.throws(error);

            await fixture.list_story_estimates(req, res);

            assert.calledWith(mockStoryFindById, storyId);
            status.calledWith(500);
            send.calledWith(match(error));
        });
    });

    describe('delete story estimate', () => {
        let expectedResponse;
        let mockStoreFindOneAndUpdate;
        const storyId = 'story1';
        const estimateId = 'estimate1';

        beforeEach(() => {
            mockStoreFindOneAndUpdate = stub(Story, 'findOneAndUpdate');
        });

        afterEach(() => {
            mockStoreFindOneAndUpdate.restore();
        });

        it('should delete estimate of the story ', async () => {
            _.set(req, 'params.storyId', storyId);
            _.set(req, 'params.estimateId', estimateId);

            expectedResponse = {message: 'Estimate successfully removed'};
            mockStoreFindOneAndUpdate.returns({});

            await fixture.delete_story_estimate(req, res);

            assert.calledWith(mockStoreFindOneAndUpdate, {_id: storyId}, { $pullAll: { estimates: [estimateId] } });
            assert.calledWith(res.json, expectedResponse);
        });


        it('should return error if there is a server error', async () => {
            _.set(req, 'params.storyId', storyId);
            _.set(req, 'params.estimateId', estimateId);
            mockStoreFindOneAndUpdate.throws(error);

            await fixture.delete_story_estimate(req, res);

            assert.calledWith(mockStoreFindOneAndUpdate, {_id: storyId}, { $pullAll: { estimates: [estimateId] } });
            status.calledWith(500);
            send.calledWith(match(error));
        });
    });

    describe('create story estimate', () => {
        let expectedResponse;
        let mockStoreFindOne;
        let mockStoreUpdate;
        let mockStoreFindOneAndUpdate;
        const storyId = 'story1';
        const userId = 'user1';
        const estimate = {};

        beforeEach(() => {
            mockStoreFindOne = stub(Story, 'findOne');
            mockStoreUpdate = stub(Story, 'update');
            mockStoreFindOneAndUpdate = stub(Story, 'findOneAndUpdate');
        });

        afterEach(() => {
            mockStoreFindOne.restore();
            mockStoreUpdate.restore();
            mockStoreFindOneAndUpdate.restore();
        });

        it('should update estimate in story when estimate for user existed before', async () => {
            _.set(req, 'params.storyId', storyId);
            _.set(req, 'body.userId', userId);
            _.set(req, 'body.estimate', estimate);
            mockStoreFindOne.returns({});
            mockStoreUpdate.returns();
            expectedResponse = { message: 'Existing estimate successfully updated'};
            await fixture.create_story_estimate(req, res);

            assert.calledWith(mockStoreFindOne, {_id: storyId, 'estimates.user': userId});
            assert.calledWith(mockStoreUpdate, { _id: storyId, "estimates.user": userId}, { $set: { "estimates.$.estimate": estimate } });
            assert.notCalled(mockStoreFindOneAndUpdate);
            assert.calledWith(res.json, expectedResponse);
        });

        it('should add estimate to story when no estimate for user existed before', async () => {
            _.set(req, 'params.storyId', storyId);
            _.set(req, 'body.userId', userId);
            _.set(req, 'body.estimate', estimate);
            mockStoreFindOne.returns();
            mockStoreFindOneAndUpdate.returns();
            expectedResponse = { message: 'Estimate successfully added to story' };
            await fixture.create_story_estimate(req, res);

            assert.calledWith(mockStoreFindOne, {_id: storyId, 'estimates.user': userId});
            assert.notCalled(mockStoreUpdate);
            assert.calledWith(mockStoreFindOneAndUpdate, { _id: storyId },{ $addToSet: { estimates: req.body } });
            assert.calledWith(res.json, expectedResponse);
        });

        it('should return error if findOne returns error', async () => {
            _.set(req, 'params.storyId', storyId);
            _.set(req, 'body.userId', userId);
            _.set(req, 'body.estimate', estimate);
            mockStoreFindOne.throws(error);

            await fixture.create_story_estimate(req, res);

            assert.calledWith(mockStoreFindOne, {_id: storyId, 'estimates.user': userId});
            assert.notCalled(mockStoreUpdate);
            assert.notCalled(mockStoreFindOneAndUpdate);
            status.calledWith(500);
            send.calledWith(match(error));
        });

        it('should return error if update returns error', async () => {
            _.set(req, 'params.storyId', storyId);
            _.set(req, 'body.userId', userId);
            _.set(req, 'body.estimate', estimate);
            mockStoreFindOne.returns({});
            mockStoreUpdate.throws(error);

            await fixture.create_story_estimate(req, res);

            assert.calledWith(mockStoreFindOne, {_id: storyId, 'estimates.user': userId});
            assert.calledWith(mockStoreUpdate, { _id: storyId, "estimates.user": userId}, { $set: { "estimates.$.estimate": estimate } });
            assert.notCalled(mockStoreFindOneAndUpdate);
            status.calledWith(500);
            send.calledWith(match(error));
        });

        it('should return error if findOneAndUpdate returns error', async () => {
            _.set(req, 'params.storyId', storyId);
            _.set(req, 'body.userId', userId);
            _.set(req, 'body.estimate', estimate);
            mockStoreFindOne.returns();
            mockStoreFindOneAndUpdate.throws(error);

            await fixture.create_story_estimate(req, res);

            assert.calledWith(mockStoreFindOne, {_id: storyId, 'estimates.user': userId});
            assert.notCalled(mockStoreUpdate);
            assert.calledWith(mockStoreFindOneAndUpdate, { _id: storyId },{ $addToSet: { estimates: req.body } });
            status.calledWith(500);
            send.calledWith(match(error));
        });
    });

});

