const _ = require('lodash');
const {spy,stub, assert, match} = require('sinon');

const Story = require('./storyModel');
const Estimate = require('./estimateModel');

const fixture = require('./storyController');

describe('Story Controller', () => {
    let req = {},
        error = new Error({ error: "blah blah" }),
        res = {}, status, send, json;

    const storyId = '123';
    const estimateId = '456';
    const userId = '789';

    beforeEach(() => {
        json = spy();
        send = spy();
        status = stub();

        res = { json, status, send};

        status.returns(res);
    });

    describe('get story by id', () => {
        let expectedResult, mockStoryFind;

        beforeEach(() => {
            mockStoryFind = stub(Story, 'findById');
        });

        afterEach(() => {
            mockStoryFind.restore();
        });

        it('should return a story', async () => {
            expectedResult = {_id: storyId};

            mockStoryFind.returns(expectedResult);

            _.set(req, 'params.storyId', storyId);

            await fixture.get_story(req, res);

            assert.calledWith(Story.findById, storyId);
            json.calledWith(match(expectedResult));            
        });
        
        it('should return error if there is a server error', async () => {
            mockStoryFind.throws(error);
            
            await fixture.get_story(req, res);
            
            assert.calledWith(Story.findById, storyId);
            status.calledWith(500);
            send.calledWith(match(error));
        });
    });


    describe('get estimate by id', () => {
        let expectedResult, mockEstimateFind;

        beforeEach(() => {
            mockEstimateFind = stub(Estimate, 'findById');
        });

        afterEach(() => {
            mockEstimateFind.restore();
        });

        it('should return a story', async () => {
            expectedResult = {_id: estimateId};

            mockEstimateFind.returns(expectedResult);

            _.set(req, 'params.estimateId', estimateId);

            await fixture.get_estimate(req, res);

            assert.calledWith(Estimate.findById, estimateId);
            json.calledWith(match(expectedResult))

        });

        it('should return error if there is a server error', async () => {
            mockEstimateFind.throws(error);

            await fixture.get_estimate(req, res);

            assert.calledWith(Estimate.findById, estimateId);
            send.calledWith(match(error));
            status.calledWith(500);
        });
    });

    describe('update estimate ',() => {
        let expectedUser, mockStoryFind, mockStoryUpdate, mockEstimateFindByUser, mockUserById, mockEstimateSave, mockEstimateFindOneAndUpdate;

        beforeEach(() => {
            mockStoryFind = sinon.stub(Story, 'findById');
            mockStoryUpdate = sinon.stub(Story, 'findOneAndUpdate');
            mockEstimateFindByUser = sinon.stub(Estimate, 'findOne');
            mockUserById = sinon.stub(User, 'findById');
            mockEstimateSave = sinon.stub(Estimate.prototype, 'save');
            mockEstimateFindOneAndUpdate = sinon.stub(Estimate, 'findOneAndUpdate');
        });

        afterEach(() => {
            mockStoryFind.restore();
            mockStoryUpdate.restore();
            mockEstimateFindByUser.restore();
            mockUserById.restore();
            mockEstimateSave.restore();
            mockEstimateFindOneAndUpdate.restore();
        });

        it('should throw error with no id', async () => {
            expectedUser = { message: 'No user id' };

            _.set(req, 'body.id', null);

            await fixture.update_story(req, res);

            sinon.assert.calledWith(res.json, expectedUser);
        });

        it('should throw error with incorrect id', async () => {
            expectedUser = { message: 'No user found with that id' };

            mockUserById.throws(error);
            _.set(req, 'body.id', '00000');

            await fixture.update_story(req, res);

            sinon.assert.calledWith(res.json, expectedUser);
        });

        it('should create new estimate when no estimate is existing for current user', async () => {
            expectedUser = {
                _id: userId,
                name: 'mockedUser'
            };

            mockUserById.returns(expectedUser);
            mockEstimateFindByUser.returns(null);

            const expectedEstimate = {
                _id: '123456789',
                estimate: '8'
            };

            mockEstimateSave.returns(expectedEstimate);
            mockEstimateFindOneAndUpdate.returns({});
            _.set(req, 'body.id', userId);
            _.set(req, 'body.estimate', '8');
            _.set(req, 'params.storyId', storyId);


            await fixture.update_story(req, res);

            sinon.assert.calledWith(mockEstimateSave);
            sinon.assert.calledWith(Story.findOneAndUpdate, { _id: storyId }, { $addToSet: { estimates: expectedEstimate } });
            sinon.assert.calledWith(res.json, sinon.match({ message: 'Estimate successfully updated' } ));
        });

        it('should update existing estimate for current user', async () => {
            expectedUser = {
                _id: userId,
                name: 'mockedUser'
            };

            const initialEstimate = {
                _id: estimateId,
                user: expectedUser,
                estimate: '8'
            };

            const expectedEstimate = {
                _id: estimateId,
                user: expectedUser,
                estimate: '13'
            };

            mockUserById.returns(expectedUser);
            mockEstimateFindByUser.returns(initialEstimate);
            mockEstimateFindOneAndUpdate.returns(expectedEstimate);

            _.set(req, 'body.id', userId);
            _.set(req, 'body.estimate', '13');

            await fixture.update_story(req, res);

            sinon.assert.calledWith(Estimate.findOneAndUpdate, { _id: estimateId }, expectedEstimate);
            sinon.assert.calledWith(res.json, sinon.match({ message: 'Estimate successfully updated' } ));
        });

        it('should throw error if update estimate fails', async () => {
            expectedUser = {
                _id: userId,
                name: 'mockedUser'
            };

            mockUserById.returns(expectedUser);
            mockEstimateFindByUser.throws(error);

            await fixture.update_story(req, res);

            sinon.assert.calledWith(res.send, sinon.match(error));

        });

    });
});

