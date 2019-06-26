const Meeting = require('../Meeting/meetingModel');
const Story = require('../Story/storyModel');
const User = require('../User/userModel');

const {stub, assert} = require('sinon');
const AdminService = require('./adminService');
const ServiceComposer = require('../serviceComposer');
const fixture = require('./adminController');

describe('Admin Controller', () => {
    let req = {}, res = {};
    let mockServiceComposer;

    before(() => {
        mockServiceComposer = stub(ServiceComposer, 'compose');
    });

    after(() => {
        mockServiceComposer.restore();
    });

    describe('deleteAll', () => {
        let mockDeleteAll;

        before(() => {
            mockDeleteAll = stub(AdminService, 'delete_all');
        });
        after(() => {
            mockDeleteAll.restore();
        });

        it('should call service composer with the delete all service, request, and response', async () => {
            await fixture.deleteAll(req, res);
            assert.calledWith(mockServiceComposer, mockDeleteAll, req, res);
        });
    });

});
