let _ = require('lodash');
let sinon = require('sinon');

let User = require('../User/userModel');
let Meeting = require('../Meeting/meetingModel');
let Story = require('./storyModel');
let Estimate = require('./estimateModel');

let fixture = require('./storyController');

describe('Story Controller', () => {
    let req = {},
        error = new Error({ error: "blah blah" }),
        res = {};

    beforeEach(() => {
        res = {
            json: sinon.spy(),
            send: sinon.spy(),
            status: sinon.stub().returns({ end: sinon.spy() })
        };
    });
    describe('get story by id', () => {
        const storyName = 'Story Name';
        const storyId = '123456789';
        let expectedResult, mockStoryFind;

        beforeEach(() => {
            mockStoryFind = sinon.stub(Story, 'findById');
        });

        afterEach(() => {
            mockStoryFind.restore();
        });

        it('should return a story', async () => {
            expectedResult = {_id: storyId};

            mockStoryFind.returns(expectedResult);

            _.set(req, 'params.storyId', storyId);

            await fixture.get_story(req, res);

            sinon.assert.calledWith(Story.findById, storyId);
            sinon.assert.calledWith(res.json, sinon.match(expectedResult));

        });

        it('should return error if there is a server error', async () => {
            mockStoryFind.throws(error);

            await fixture.get_story(req, res);

            sinon.assert.calledWith(Story.findById, storyId);
            sinon.assert.calledWith(res.send, sinon.match(error));
        });
    });
});

