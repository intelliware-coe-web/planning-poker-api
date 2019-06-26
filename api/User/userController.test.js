const {stub, assert} = require('sinon');
const UserService = require('./userService');
const ServiceComposer = require('../serviceComposer');
const fixture = require('./userController');

describe('User controller', () => {
    let req = {}, res = {};
    let mockServiceComposer;

    before(() => {
        mockServiceComposer = stub(ServiceComposer, 'compose');
    });

    after(() => {
        mockServiceComposer.restore();
    });

    describe('listUsers', () => {
        let mockListUsers;

        before(() => {
            mockListUsers = stub(UserService, 'list_users');
        });
        after(() => {
            mockListUsers.restore();
        });

        it('should call service composer with the list users service, request, and response', async () => {
            await fixture.listUsers(req, res);
            assert.calledWith(mockServiceComposer, mockListUsers, req, res);
        });
    });

    describe('createUser', () => {
        let mockCreateUser;

        before(() => {
            mockCreateUser = stub(UserService, 'create_user');
        });
        after(() => {
            mockCreateUser.restore();
        });

        it('should call service composer with the create user service, request, and response', async () => {
            await fixture.createUser(req, res);
            assert.calledWith(mockServiceComposer, mockCreateUser, req, res);
        });
    });

    describe('getUser', () => {
        let mockGetUser;

        before(() => {
            mockGetUser = stub(UserService, 'get_user');
        });
        after(() => {
            mockGetUser.restore();
        });

        it('should call service composer with the get user service, request, and response', async () => {
            await fixture.getUser(req, res);
            assert.calledWith(mockServiceComposer, mockGetUser, req, res);
        });
    });

    describe('deleteUser', () => {
        let mockDeleteUser;

        before(() => {
            mockDeleteUser = stub(UserService, 'delete_user');
        });
        after(() => {
            mockDeleteUser.restore();
        });

        it('should call service composer with the delete user service, request, and response', async () => {
            await fixture.deleteUser(req, res);
            assert.calledWith(mockServiceComposer, mockDeleteUser, req, res);
        });
    });
});
