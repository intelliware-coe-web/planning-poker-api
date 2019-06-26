const adminService = require('./adminService');
const ServiceComposer = require('../serviceComposer');

exports.deleteAll = async (req, res) => {
    return await ServiceComposer.compose(adminService.delete_all, req, res);
};
