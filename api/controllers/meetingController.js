'use strict';

var mongoose = require('mongoose'),
Meeting = mongoose.model('Meeting'),
User = mongoose.model('User'),
Ticket = mongoose.model('Ticket');

var utilController = require('../utils/utilController');
var returnResponse = utilController.returnResponse;
var returnDeleteResponse = utilController.returnDeleteResponse;

exports.list_meetings = function(req, res) {
  Meeting.find({}, returnResponse(res));
};

exports.create_meeting = function(req, res) {
  var new_meeting = new Meeting(req.body);
  new_meeting.save(returnResponse(res));
};

exports.get_meeting = function(req, res) {
  Meeting.findById(req.params.meetingId, returnResponse(res));
};

exports.delete_meeting = function(req, res) {
  Meeting.remove({
    _id: req.params.meetingId
  }, returnDeleteResponse(res));
};

exports.list_attendees = function(req, res) {
  Meeting.findById(req.params.meetingId, function(err, meeting) {
    if (err)
      res.send(err);
    res.json(meeting.attendees);
  });
};

exports.delete_attendee = function(req, res) {
  const userId = req.body.id;

  Meeting.findOneAndUpdate(
    { _id: req.params.meetingId },
    { $pullAll: {attendees: [userId]}},
    function(err, meeting) {
      if (err)
        res.send(err);
      res.json({message: 'Attendee successfully removed'});
  })
}

exports.create_attendee = function(req, res) {
  const userId = req.body.id;

  User.findById(userId, function(err, user) {
    if (user == null) {
      res.send('No user found with that id');
    }

    Meeting.findOneAndUpdate(
      { _id: req.params.meetingId },
      { $addToSet: { attendees: user } },
      function(err, meeting) {
        if (err)
          res.send(err);
        res.json({message: 'Attendee successfully added'});
      }
    )
  });
};

exports.list_tickets = function(req, res) {
  Meeting.findById(req.params.meetingId, function(err, meeting) {
    if (err)
      res.send(err);
    res.json(meeting.tickets);
  });
};

exports.delete_ticket = function(req, res) {
  const ticketId = req.body.id;

  Meeting.findOneAndUpdate(
    { _id: req.params.meetingId },
    { $pullAll: {tickets: [ticketId]}},
    function(err, meeting) {
      if (err) {
        res.send(err);
      } else {
        res.json({message: 'Ticket successfully removed'});
      }
  })
}

exports.create_ticket = function(req, res) {
  var new_ticket = new Ticket(req.body);
  new_ticket.save(function(err, ticket) {
    if (err)
      res.send(err);

    Meeting.findOneAndUpdate(
      { _id: req.params.meetingId },
      { $addToSet: { tickets: new_ticket } },
      function(err, meeting) {
        if (err) {
          res.send(err);
        } else {
          res.json({message: 'Ticket successfully added'});
        }
      }
    )
  });
};

