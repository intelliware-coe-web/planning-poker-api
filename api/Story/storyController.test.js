const _ = require('lodash');
const {spy,stub, assert, match} = require('sinon');

const Story = require('./storyModel');
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
        req = {};

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
            _.set(req, 'params.storyId', storyId);
        });

        afterEach(() => {
            mockStoryFindById.restore();
        });

        it('should return a story', async () => {
            expectedResult = {_id: storyId};

            mockStoryFindById.returns(expectedResult);

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

            let mockStoryFindOneResult = { populate: stub().returns(expectedStory) };

            mockStoryFindById.returns(mockStoryFindOneResult);

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
        let mockStoryUpdateOne;
        const storyId = 'story1';
        const estimateId = 'estimate1';

        beforeEach(() => {
            mockStoryUpdateOne = stub(Story, 'updateOne');
        });

        afterEach(() => {
            mockStoryUpdateOne.restore();
        });

        it('should delete estimate of the story ', async () => {
            _.set(req, 'params.storyId', storyId);
            _.set(req, 'params.estimateId', estimateId);

            expectedResponse = {message: 'Estimate successfully removed'};
            mockStoryUpdateOne.returns({});

            await fixture.delete_story_estimate(req, res);

            assert.calledWith(mockStoryUpdateOne, {_id: storyId}, { $pull: { estimates: { _id: estimateId } } });
            assert.calledWith(res.json, expectedResponse);
        });


        it('should return error if there is a server error', async () => {
            _.set(req, 'params.storyId', storyId);
            _.set(req, 'params.estimateId', estimateId);
            mockStoryUpdateOne.throws(error);

            await fixture.delete_story_estimate(req, res);

            assert.calledWith(mockStoryUpdateOne, {_id: storyId}, { $pull: { estimates: { _id: estimateId } } });
            status.calledWith(500);
            send.calledWith(match(error));
        });
    });

    describe('create story estimate', () => {
        let expectedResponse;
        let mockStoryUpdateOne;
        let mockStoryFindOne;
        const storyId = 'story1';
        const user = 'user1';
        const estimate = 8;

        beforeEach(() => {
            mockStoryUpdateOne = stub(Story, 'updateOne');
            mockStoryFindOne = stub(Story, 'findOne');

            _.set(req, 'params.storyId', storyId);
            _.set(req, 'body.user', user);
            _.set(req, 'body.estimate', estimate);
        });

        afterEach(() => {
            mockStoryUpdateOne.restore();
            mockStoryFindOne.restore();
        });

        it('should update estimate in story when estimate for user existed before', async () => {
            mockStoryUpdateOne.returns({n: 1}); // 1 story found and updated

            mockStoryFindOne.returns({
                _id: storyId, 
                estimates: [{user: 1, estimate: 8}]
            });

            expectedResponse = { message: 'Existing estimate successfully updated'};
            await fixture.update_story_estimate(req, res);

            assert.calledWith(mockStoryUpdateOne, {_id: storyId, 'estimates.user': user}, { $set: {'estimates.$.estimate': estimate}});
            
            // updating estimate_avg
            assert.calledWith(mockStoryFindOne, { _id: storyId } );          
            assert.calledWith(mockStoryUpdateOne, { _id: storyId }, { $set: { estimate_avg: 8 }});
            assert.calledWith(res.json, expectedResponse);
        });

        it('should add estimate to story when no estimate for user existed before', async () => {
            mockStoryUpdateOne.returns({n: 0}); // nothing was updated
            mockStoryFindOne.returns({
                _id: storyId, 
                estimates: [{user: 1, estimate: 8}]
            });

            expectedResponse = { message: 'Estimate successfully added to story' };
            await fixture.update_story_estimate(req, res);

            assert.calledThrice(mockStoryUpdateOne);
            assert.calledWith(mockStoryUpdateOne, {_id: storyId, 'estimates.user': user}, { $set: {'estimates.$.estimate': estimate}});
            assert.calledWith(mockStoryUpdateOne, { _id: storyId },{ $addToSet: { estimates: {user: user, estimate: estimate} } });
            
            // updating estimate_avg
            assert.calledWith(mockStoryFindOne, { _id: storyId } );          
            assert.calledWith(mockStoryUpdateOne, { _id: storyId }, { $set: { estimate_avg: 8 }});
            assert.calledWith(res.json, expectedResponse);
        });

        it('should return error if updateOne returns error', async () => {
            mockStoryUpdateOne.throws(error);

            await fixture.update_story_estimate(req, res);

            assert.calledWith(mockStoryUpdateOne, {_id: storyId, 'estimates.user': user}, { $set: {'estimates.$.estimate': estimate}});
            status.calledWith(500);
            send.calledWith(match(error));
        });
    });

});

