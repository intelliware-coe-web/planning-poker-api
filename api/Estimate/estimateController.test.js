const _ = require('lodash');
const {spy,stub, assert, match} = require('sinon');

const Estimate = require('./estimateModel');
const User = require('../User/userModel');
const Story = require('../Story/storyModel');

const fixture = require('./estimateController');

describe('Estimate Controller', ()=> {
    let req = {},
        error = new Error({ error: "blah blah" }),
        res = {}, status, send, json;

    beforeEach(() => {
        json = spy();
        send = spy();
        status = stub();

        res = { json, status, send};

        status.returns(res);
    });

    describe('Update estimate ', () => {
        let expectedResponse, expectedUser, expectedStory, reqBody;
        let mockUserFindById, mockStoryFindById, mockEstimateFindOneAndUpdate;
        const userId = 123321 + 'y' + 123;
        const storyId = 456654;
        const estimate = '8';

        beforeEach(() => {
            mockUserFindById = stub(User, 'findById');
            mockStoryFindById = stub(Story, 'findById');
            mockEstimateFindOneAndUpdate = stub(Estimate, 'findOneAndUpdate');
        });

        afterEach(() => {
            mockUserFindById.restore();
            mockStoryFindById.restore();
            mockEstimateFindOneAndUpdate.restore();
        });

        it('should throw error with no user id when no userId is given', async () => {
            expectedResponse = { message: 'No userId' };
            reqBody = { userId: null, storyId: null, estimate: null };

            _.set(req, 'body', reqBody);

            await fixture.update_estimate(req, res);

            assert.calledWith(res.json, expectedResponse);
        });

        it('should throw error with no story id when no storyId is given', async () => {
            expectedResponse = { message: 'No storyId' };
            expectedUser = { _id: userId, name: 'mockedUser' };
            reqBody = { userId: userId, storyId: null, estimate: null };

            _.set(req, 'body', reqBody);

            mockUserFindById.returns(expectedUser);

            await fixture.update_estimate(req, res);

            assert.calledWith(res.json, expectedResponse);
        });

        it('should throw error with no estimate when no estimate is given', async () => {
            expectedResponse = { message: 'No estimate given' };
            expectedUser = { _id: userId, name: 'mockedUser' };
            expectedStory = { _id: storyId, name: 'mock story name', description: 'mock description' };
            reqBody = { userId: userId, storyId: storyId, estimate: null };

            _.set(req, 'body', reqBody);

            mockStoryFindById.returns(expectedStory);

            await fixture.update_estimate(req, res);

            assert.calledWith(res.json, expectedResponse);
        });

        it('should update user story estimate', async () => {
            expectedResponse = {message: 'Estimate updated.'};
            expectedUser = { _id: 12345, name: 'mockedUser'};
            expectedStory = { _id: storyId, name: 'mock story name', description: 'mock description' };
            reqBody = { userId: userId, storyId: storyId, estimate: estimate };

            _.set(req, 'body', reqBody);

            mockUserFindById.returns(expectedUser);
            mockStoryFindById.returns(expectedStory);

            await fixture.update_estimate(req, res);

            assert.calledWith(res.json, expectedResponse);
        });

        it('should return error if there is a server error', async () => {
            mockEstimateFindOneAndUpdate.throws(error);

            await fixture.update_estimate(req, res);

            status.calledWith(500);
            send.calledWith(match(error));
        });
    });

    describe('Get Estimates By Story Id', () => {
        let expectedResponse;
        let mockEstimateFind;
        const storyId = '123';

        beforeEach(() => {
            mockEstimateFind = stub(Estimate, 'find');
        });

        afterEach(() => {
            mockEstimateFind.restore();
        });

        it('should return estimate list with for given story id', async () => {
            expectedResponse = [ {_id: 'id1', user: {}, story: {_id: '123'}, estimate: 3},
                                 {_id: 'id2', user: {}, story: {_id: '123'}, estimate: 5} ];

            _.set(req, 'params.storyId', storyId);

            mockEstimateFind.returns(expectedResponse);

            await fixture.get_estimates_by_storyId(req, res);

            assert.calledWith(mockEstimateFind, {story: { _id: storyId } });
            assert.calledWith(res.json, expectedResponse);
        });


        it('should return error if there is a server error', async () => {
            mockEstimateFind.throws(error);

            _.set(req, 'params.storyId', storyId);
            await fixture.get_estimates_by_storyId(req, res);

            assert.calledWith(mockEstimateFind, {story: { _id: storyId } });
            status.calledWith(500);
            send.calledWith(match(error));
        });
    });

    describe('List Estimates', () => {
        let expectedResponse;
        let mockEstimateFind;

        beforeEach(() => {
            mockEstimateFind = stub(Estimate, 'find');
        });

        afterEach(() => {
            mockEstimateFind.restore();
        });

        it('should return list of estimates', async () => {
            expectedResponse = [ {_id: 'id1', user: {}, story: {_id: '123'}, estimate: 3},
                                 {_id: 'id2', user: {}, story: {_id: '123'}, estimate: 5} ];

            mockEstimateFind.returns(expectedResponse);

            await fixture.list_estimates(req, res);

            assert.calledOnce(mockEstimateFind);
            assert.calledWith(res.json, expectedResponse);
        });


        it('should return error if there is a server error', async () => {
            mockEstimateFind.throws(error);

            await fixture.list_estimates(req, res);

            assert.calledOnce(mockEstimateFind);
            status.calledWith(500);
            send.calledWith(match(error));
        });
    });

    describe('Delete Estimate', () => {
        let expectedResponse;
        let mockEstimateDeleteOne;
        const estimateId = '123';

        beforeEach(() => {
            mockEstimateDeleteOne = stub(Estimate, 'deleteOne');
        });

        afterEach(() => {
            mockEstimateDeleteOne.restore();
        });

        it('should delete an estimate ', async () => {
            expectedResponse = {message: 'Estimate successfully deleted'};

            mockEstimateDeleteOne.returns({});

            _.set(req, 'params.estimateId', estimateId);

            await fixture.delete_estimate(req, res);

            assert.calledWith(mockEstimateDeleteOne, {_id: estimateId});
            assert.calledWith(res.json, expectedResponse);
        });


        it('should return error if there is a server error', async () => {
            mockEstimateDeleteOne.throws(error);
            _.set(req, 'params.estimateId', estimateId);

            await fixture.delete_estimate(req, res);

            assert.calledWith(mockEstimateDeleteOne, {_id: estimateId});
            status.calledWith(500);
            send.calledWith(match(error));
        });
    });

});