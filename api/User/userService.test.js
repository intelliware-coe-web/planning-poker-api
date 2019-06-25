const _ = require('lodash');
const {match, stub, assert} = require('sinon');

const User = require('./userModel');
const fixture = require('./userService');

describe('User Service', () => {
    let req = {}, res = {};

    describe('list_users', () => {
        let mockUserFind;

        before(() => {
            mockUserFind = stub(User, 'find');
        });

        after(() => {
            mockUserFind.restore();
        });

        it('should return a list of users', async () => {
            const expectedResult = [];
            mockUserFind.returns(expectedResult);

            const actualResult = await fixture.list_users(req);

            assert.called(mockUserFind);
            assert.match(actualResult, expectedResult);
        });
    });

    describe('create_user', () => {
        let mockUserFindOne, mockUser;
        const mockUsername = 'Bob';

        before(() => {
            mockUserFindOne = stub(User, 'findOne');
            mockUser = stub(User.prototype, 'save');
        });

        after(() => {
            mockUserFindOne.restore();
            mockUser.restore();
        });

        it('should return user if one already exists', async () => {
            const expectedResult = {name: mockUsername};
            _.set(req, 'body.name', mockUsername);

            mockUserFindOne.returns(expectedResult);

            const actualResult = await fixture.create_user(req);

            assert.calledWith(mockUserFindOne, match.has('name', mockUsername));
            assert.match(actualResult, expectedResult);
        });

        it('should create new user if user name does not exist', async () => {
            const expectedResult = {name: mockUsername};
            _.set(req, 'body.name', mockUsername);

            mockUserFindOne.returns(null);
            mockUser.returns(expectedResult);

            const actualResult = await fixture.create_user(req);

            assert.calledWith(mockUserFindOne, match.has('name', mockUsername));
            assert.called(mockUser);
            assert.match(actualResult, expectedResult);
        });
    });

    describe('get_user', () => {
        let mockUserFindById;

        before(() => {
            mockUserFindById = stub(User, 'findById');
        });

        after(() => {
            mockUserFindById.restore();
        });

        it('should return single user', async () => {
            const expectedResult = {name: 'Bobo'};
            const userId = '123abc';
            _.set(req, 'params.userId', userId);

            mockUserFindById.returns(expectedResult);

            const actualResult = await fixture.get_user(req);

            assert.calledWith(mockUserFindById, userId);
            assert.match(actualResult, expectedResult);
        });
    });

    describe('delete_user', () => {
        let mockUserDeleteOne;

        before(() => {
            mockUserDeleteOne = stub(User, 'deleteOne');
        });

        after(() => {
            mockUserDeleteOne.restore();
        });

        it('should return single user', async () => {
            const expectedResult = {message: 'User successfully deleted'};
            const userId = '123abc';
            _.set(req, 'params.userId', userId);

            mockUserDeleteOne.returns(expectedResult);

            const actualResult = await fixture.delete_user(req);

            assert.calledWith(mockUserDeleteOne, match.has('_id', userId));
            assert.match(actualResult, expectedResult);
        });
    });
});