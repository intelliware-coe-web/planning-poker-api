let _ = require('lodash');
let sinon = require('sinon');

let User = require('./userModel');
let fixture = require('./userController');

describe('User controller', function() {
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

    describe('List users', function() {
        let expectedResult, mockUserFind;
    
        beforeEach(() => {
            mockUserFind = sinon.stub(User, 'find');
        });
    
        afterEach(() => {
            mockUserFind.restore();
        })

        it('should return all users', async() => {
            expectedResult = [];
            mockUserFind.returns(expectedResult);

            await fixture.list_users(req, res);

            sinon.assert.called(User.find);
            sinon.assert.calledWith(res.json, sinon.match(expectedResult));
        });

        it('should return error if there is a server error', async () => {
            mockUserFind.throws(error);

            await fixture.list_users(req, res);

            sinon.assert.calledWith(User.find);
            sinon.assert.calledWith(res.send, sinon.match(error));
        });
    });

    describe('Create user', function() {
        let mockUserSave;
        
        before(() => {
            mockUserSave = sinon.stub(User.prototype, 'save');
        });

        after(() => {
            mockUserSave.restore();
        });

        it('should create new user', async() => {
            const expectedResult = {};
            mockUserSave.returns(expectedResult);
    
            await fixture.create_user(req, res);

            sinon.assert.calledWith(mockUserSave);
            sinon.assert.calledWith(res.json, sinon.match(expectedResult));
        });

        it('should return error if there is a server error', async() => {
            mockUserSave.throws(error);

            await fixture.create_user(req, res);

            sinon.assert.calledWith(mockUserSave);
            sinon.assert.calledWith(res.send, sinon.match(error));
        });
    });

    describe('Get user by id', function() {
        let mockUserFindById;
        
        before(() => {
            mockUserFindById = sinon.stub(User, 'findById');
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

            sinon.assert.calledWith(User.findById, userId);
            sinon.assert.calledWith(res.json, sinon.match(expectedResult));
        });        

        it('should return error if there is a server error', async() => {
            mockUserFindById.throws(error);

            await fixture.get_user(req, res);

            sinon.assert.calledWith(User.findById);
            sinon.assert.calledWith(res.send, sinon.match(error));
        });
    });

    describe('Delete user by id', function() {
        let mockUserRemove;
        
        before(() => {
            mockUserRemove = sinon.stub(User, 'remove');
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

            sinon.assert.calledWith(User.remove, {_id: userId});
            sinon.assert.calledWith(res.json, sinon.match(expectedResult));
        });

        it('should return error if there is a server error', async() => {
            mockUserRemove.throws(error);

            await fixture.delete_user(req, res);

            sinon.assert.calledWith(User.remove);
            sinon.assert.calledWith(res.send, sinon.match(error));
        });
    });

});