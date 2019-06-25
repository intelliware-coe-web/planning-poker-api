const userService = require('./userService');
const ServiceComposer = require('../serviceComposer');

exports.listUsers = async (req, res) => {
    return await ServiceComposer.compose(userService.list_users, req, res);
};

exports.createUser = async (req, res) => {
    return await ServiceComposer.compose(userService.create_user, req, res);
};

exports.getUser = async (req, res) => {
    return await ServiceComposer.compose(userService.get_user, req, res);
};

exports.deleteUser = async (req, res) => {
    return await ServiceComposer.compose(userService.delete_user, req, res);
};