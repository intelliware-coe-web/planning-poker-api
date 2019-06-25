const {spy, stub, assert} = require('sinon');
const fixture = require('./serviceComposer');

describe('Service composer', () => {
    let service,
        req = {},
        res = {}, status, send, json,
        error = new Error({error: "blah blah"});

    beforeEach(() => {
        service = stub();

        json = spy();
        send = spy();
        status = stub();

        res = {json, status, send};

        status.returns(res);
    });

    it('should call the service with the request and set it into the response json', async () => {
        const expectedResponse = {success: 'The call was successful'};
        service.returns(expectedResponse);

        await fixture.compose(service, req, res);

        assert.calledWith(service, req);
        assert.calledWith(json, expectedResponse);
    });

    it('should return error if there is a server error', async () => {
        service.throws(error);

        await fixture.compose(service, req, res);

        assert.calledWith(service, req);
        assert.calledWith(status, 500);
        assert.calledWith(send, error);
    });

});
