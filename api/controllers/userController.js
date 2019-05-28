'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User');

var utilController = require('../utils/utilController');
var returnResponse = utilController.returnResponse;
var returnDeleteResponse = utilController.returnDeleteResponse;

exports.list_users = function(req, res) {
  User.find({}, returnResponse(res));
};

exports.create_user = function(req, res) {
  var new_user = new User(req.body);
  new_user.save(returnResponse(res));
};

exports.get_user = function(req, res) {
  User.findById(req.params.userId, returnResponse(res));
};

exports.delete_user = function(req, res) {
  User.remove({
    _id: req.params.userId
  }, returnDeleteResponse(res));
};
