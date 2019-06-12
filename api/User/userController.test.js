const _ = require('lodash');
const {spy,stub, assert, match} = require('sinon');

const User = require('./userModel');
const fixture = require('./userController');

describe('User controller', function() {
    let req = {},
    error = new Error({ error: "blah blah" }),
    res = {}, status, send, json;

    beforeEach(() => {
        json = spy();
        send = spy();
        status = stub();
        req = {};

        res = { json, status, send};

        status.returns(res);
    });

    describe('List users', function() {
        let expectedResult, mockUserFind;
    
        beforeEach(() => {
            mockUserFind = stub(User, 'find');
        });
    
        afterEach(() => {
            mockUserFind.restore();
        });

        it('should return all users', async() => {
            expectedResult = [];
            mockUserFind.returns(expectedResult);

            await fixture.list_users(req, res);

            assert.called(User.find);
            assert.calledWith(res.json, match(expectedResult));
        });

        it('should return error if there is a server error', async () => {
            mockUserFind.throws(error);

            await fixture.list_users(req, res);

            assert.calledWith(User.find);
            status.calledWith(500);
            send.calledWith(match(error));
        });
    });

    describe('Create user', function() {
        let mockUserSave, mockUserFind;
        
        before(() => {
            mockUserFind = stub(User, 'findOne');
            mockUserSave = stub(User.prototype, 'save');
        });

        after(() => {
            mockUserFind.restore();
            mockUserSave.restore();
        });

        it('should create new user if user name does not exist', async() => {
            _.set(req, 'body.name', 'Bob');
            const expectedResult = {};
            mockUserFind.returns(null)
            mockUserSave.returns(expectedResult);            
    
            await fixture.create_user(req, res);

            assert.calledWith(mockUserFind, {name: 'Bob'});
            assert.called(mockUserSave);
            assert.calledWith(res.json, match(expectedResult));
        });

        it('should return user if there is already one that exists', async() => {
            _.set(req, 'body.name', 'Bob');
            const expectedResult = { name: 'Bob' };
            mockUserFind.returns(expectedResult)
    
            await fixture.create_user(req, res);

            assert.calledWith(mockUserFind, {name: 'Bob'});
            assert.calledWith(res.json, match(expectedResult));
        });

        it('should return error if there is a server error', async() => {
            mockUserFind.returns(null)
            mockUserSave.throws(error);

            await fixture.create_user(req, res);

            assert.calledWith(mockUserSave);
            status.calledWith(500);
            send.calledWith(match(error));
        });
    });

    describe('Get user by id', function() {
        let mockUserFindById;
        
        before(() => {
            mockUserFindById = stub(User, 'findById');
        });

        after(() => {
            mockUserFindById.restore();
        });

        it('should return the user', async() => {
            const userId = '123abc';
            _.set(req, 'params.userId', userId);

            const expectedResult = {};
            mockUserFindById.returns(expectedResult);
    
            await fixture.get_user(req, res);

            assert.calledWith(User.findById, userId);
            assert.calledWith(res.json, match(expectedResult));
        });        

        it('should return error if there is a server error', async() => {
            mockUserFindById.throws(error);

            await fixture.get_user(req, res);

            assert.calledWith(User.findById);
            status.calledWith(500);
            send.calledWith(match(error));
        });
    });

    describe('Delete user by id', function() {
        let mockUserRemove;
        
        before(() => {
            mockUserRemove = stub(User, 'remove');
        });

        after(() => {
            mockUserRemove.restore();
        });

        it('should delete the user', async() => {
            const userId = '123abc';
            _.set(req, 'params.userId', userId);

            const expectedResult = {
                message: 'User successfully deleted'
            };
            mockUserRemove.returns({});

            await fixture.delete_user(req, res);

            assert.calledWith(User.remove, {_id: userId});
            assert.calledWith(res.json, match(expectedResult));
        });

        it('should return error if there is a server error', async() => {
            mockUserRemove.throws(error);

            await fixture.delete_user(req, res);

            assert.calledWith(User.remove);
            status.calledWith(500);
            send.calledWith(match(error));
        });
    });

});