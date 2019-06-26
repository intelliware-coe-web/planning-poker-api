const _ = require('lodash');
const {match, stub, assert} = require('sinon');

const Story = require('./storyModel');
const fixture = require('./storyService');

describe('Story Service', () => {
    let req = {}, res = {};
    const meetingId = 'Mock Meeting Id';
    const storyId = 'Mock Story Id';
    const estimateId = 'Mock Estimate Id';
    const user = 'Mock User';
    const estimate = 8;
    const storyName = 'Mock Story Name';

    describe('list_story', () => {
        let mockStoryFind;

        before(() => {
            mockStoryFind = stub(Story, 'find');
        });

        after(() => {
            mockStoryFind.restore();
        });

        it('should return a list of stories', async () => {
            const expectedResult = [];
            mockStoryFind.returns(expectedResult);

            const actualResult = await fixture.list_stories(req);

            assert.called(mockStoryFind);
            assert.match(actualResult, expectedResult);
        });
    });

    describe('create_story', () => {
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
            const expectedResult = {message: 'Story successfully created'};
            const meetingId = 123456;

            _.set(req, 'body', {name: storyName});
            _.set(req, 'query.meetingId', meetingId);

            const actualResult = await fixture.create_story(req, res);

            mockStoryValidate.returns({});

            assert.called(mockStorySave);
            assert.match(actualResult, expectedResult);
        });
    });

    describe('get_story', () => {
        let mockStoryFindById;

        before(() => {
            mockStoryFindById = stub(Story, 'findById');
        });

        after(() => {
            mockStoryFindById.restore();
        });

        it('should return a story', async () => {
            const expectedResult = {'_id': storyId};
            _.set(req, 'params.storyId', storyId);

            mockStoryFindById.returns(expectedResult);

            const actualResult = await fixture.get_story(req);

            assert.calledWith(mockStoryFindById, storyId);
            assert.match(actualResult, expectedResult);
        });
    });

    describe('get_stories_by_meetingId', () => {
        let mockStoryFind;

        before(() => {
            mockStoryFind = stub(Story, 'find');
        });

        after(() => {
            mockStoryFind.restore();
        });

        it('should return a list of stories', async () => {
            const expectedResult = [{'_id': storyId}];
            _.set(req, 'query.meetingId', meetingId);

            mockStoryFind.returns(expectedResult);

            const actualResult = await fixture.get_stories_by_meetingId(req);

            assert.calledWith(mockStoryFind, match.has('meetingId', meetingId));
            assert.match(actualResult, expectedResult);
        });
    });

    describe('delete_story', () => {
        let mockStoryDeleteOne;

        before(() => {
            mockStoryDeleteOne = stub(Story, 'deleteOne');
        });

        after(() => {
            mockStoryDeleteOne.restore();
        });

        it('should delete a story', async () => {
            const expectedResult = {message: 'Story successfully removed'};
            _.set(req, 'params.storyId', storyId);

            const actualResult = await fixture.delete_story(req);

            assert.calledWith(mockStoryDeleteOne, match.has('_id', storyId));
            assert.match(actualResult, expectedResult);
        });
    });

    describe('list_story_estimates', () => {
        let mockStoryFindById;

        before(() => {
            mockStoryFindById = stub(Story, 'findById');
        });

        after(() => {
            mockStoryFindById.restore();
        });

        it('should list estimates of a story', async () => {
            const expectedResult = [];
            const expectedStory = {
                _id: storyId,
                name: storyName,
                meeting: {
                    _id: meetingId
                },
                estimates: expectedResult
            };
            _.set(req, 'params.storyId', storyId);
            let mockStoryFindOneResult = {populate: stub().returns(expectedStory)};
            mockStoryFindById.returns(mockStoryFindOneResult);

            const actualResult = await fixture.list_story_estimates(req);

            assert.calledWith(mockStoryFindById, storyId);
            assert.match(actualResult, expectedResult);
        });

        it('should return message if story is null', async () => {
            const expectedResult = {message: 'No story found for that id'};
            const expectedStory = null;
            _.set(req, 'params.storyId', storyId);
            let mockStoryFindOneResult = {populate: stub().returns(expectedStory)};
            mockStoryFindById.returns(mockStoryFindOneResult);

            const actualResult = await fixture.list_story_estimates(req);

            assert.calledWith(mockStoryFindById, storyId);
            assert.match(actualResult, expectedResult);
        });
    });

    describe('delete_story_estimate', () => {
        let mockStoryUpdateOne;

        before(() => {
            mockStoryUpdateOne = stub(Story, 'updateOne');
        });

        after(() => {
            mockStoryUpdateOne.restore();
        });

        it('should delete a story', async () => {
            const expectedResult = {message: 'Estimate successfully removed'};
            _.set(req, 'params.storyId', storyId);
            _.set(req, 'params.estimateId', estimateId);

            const actualResult = await fixture.delete_story_estimate(req);

            assert.calledWith(mockStoryUpdateOne, match.has('_id', storyId), match.has('$pull', match.has('estimates', match.has('_id', estimateId))));
            assert.match(actualResult, expectedResult);
        });
    });

    describe('update_story_estimate', () => {
        let mockStoryUpdateOne, mockStoryFindOne;

        beforeEach(() => {
            mockStoryUpdateOne = stub(Story, 'updateOne');
            mockStoryFindOne = stub(Story, 'findOne');

            _.set(req, 'params.storyId', storyId);
            _.set(req, 'body.user', user);
            _.set(req, 'body.name', storyName);
            _.set(req, 'body.estimate', estimate);
        });

        afterEach(() => {
            mockStoryUpdateOne.restore();
            mockStoryFindOne.restore();
        });

        it('should update estimate in story when estimate for user existed before', async () => {
            const expectedResponse = {message: 'Existing estimate successfully updated'};
            mockStoryUpdateOne.returns({n: 1}); // 1 story found and updated
            mockStoryFindOne.returns({
                _id: storyId,
                estimates: [{user: 1, estimate: estimate}]
            });

            const actualResponse = await fixture.update_story_estimate(req, res);

            assert.calledTwice(mockStoryUpdateOne);
            assert.calledWith(mockStoryUpdateOne.firstCall, match({
                _id: storyId,
                'estimates.user': user
            }), match.has('$set', match.has('estimates.$.estimate', estimate)));

            // updating estimate_avg
            assert.calledWith(mockStoryFindOne, match.has('_id', storyId));
            assert.calledWith(mockStoryUpdateOne.secondCall, match.has('_id', storyId), match.has('$set', match.has('estimate_avg', estimate)));
            assert.match(actualResponse, expectedResponse);
        });

        it('should add estimate to story when no estimate for user existed before', async () => {
            const expectedResponse = {message: 'Estimate successfully added to story'};
            mockStoryUpdateOne.returns({n: 0}); // nothing was updated
            mockStoryFindOne.returns({
                _id: storyId,
                estimates: [{user: 1, estimate: estimate}]
            });

            const actualResponse = await fixture.update_story_estimate(req, res);

            assert.calledThrice(mockStoryUpdateOne);
            assert.calledWith(mockStoryUpdateOne.firstCall, match({
                _id: storyId,
                'estimates.user': user
            }), match.has('$set', match.has('estimates.$.estimate', estimate)));
            assert.calledWith(mockStoryUpdateOne.secondCall, match.has('_id', storyId), match.has('$addToSet', match.has('estimates', match({
                name: storyName,
                user: user,
                estimate: estimate
            }))));

            // updating estimate_avg
            assert.calledWith(mockStoryFindOne, match.has('_id', storyId));
            assert.calledWith(mockStoryUpdateOne.thirdCall, match.has('_id', storyId), match.has('$set', match.has('estimate_avg', estimate)));
            assert.match(actualResponse, expectedResponse);
        });
    });

});

