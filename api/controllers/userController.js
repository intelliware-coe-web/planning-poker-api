'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('Users');

exports.list_users = function(req, res) {
  User.find({}, function(err, task) {
    if (err)
      res.send(err);
    res.json(User);
  });
};

exports.create_user = function(req, res) {
  var new_user = new User(req.body);
  new_user.save(function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};

exports.get_user = function(req, res) {
  User.findById(req.params.userId, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};

exports.delete_user = function(req, res) {
  User.remove({
    _id: req.params.taskId
  }, function(err, user) {
    if (err)
      res.send(err);
    res.json({ message: 'User successfully deleted' });
  });
};
