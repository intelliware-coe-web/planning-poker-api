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

});

