'use strict';

var mongoose = require('mongoose'),
Meeting = mongoose.model('Meeting'),
User = mongoose.model('User');

exports.list_meetings = function(req, res) {
  Meeting.find({}, function(err, meetings) {
    if (err)
      res.send(err);
    res.json(meetings);
  });
};

exports.create_meeting = function(req, res) {
  console.log(req.body.name);
  var new_meeting = new Meeting(req.body);
  new_meeting.save(function(err, meeting) {
    if (err)
      res.send(err);
    res.json(meeting);
  });
};

exports.get_meeting = function(req, res) {
  Meeting.findById(req.params.meetingId, function(err, meeting) {
    if (err)
      res.send(err);
    res.json(meeting);
  });
};

exports.delete_meeting = function(req, res) {
  Meeting.remove({
    _id: req.params.meetingId
  }, function(err, meeting) {
    if (err)
      res.send(err);
    res.json({ message: 'Meeting successfully deleted' });
  });
};

exports.list_attendees = function(req, res) {
  Meeting.findById(req.params.meetingId, function(err, meeting) {
    if (err)
      res.send(err);
    res.json(meeting.attendees);
  });
};

exports.create_attendee = function(req, res) {
  Meeting.findOneAndUpdate(
    { _id: req.params.meetingId },
    { $push: { attendees: req.body.id } },
    function(err, success) {
      if (err) {
        res.send(err);
      } else {
        res.json(success);
      }
    }
  )
};
