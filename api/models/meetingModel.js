'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MeetingSchema = new Schema({
  host: String,
  attendees: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  created_date: {
    type: Date,
    default: Date.now
  } 
});

module.exports = mongoose.model('Meeting', MeetingSchema);