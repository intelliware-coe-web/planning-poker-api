'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MeetingSchema = new Schema({
    name: {
        type: String,
        required: 'Name is required'
    },
    host: String,
    attendees: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    stories: [{
        type: Schema.Types.ObjectId,
        ref: 'Story'
    }],
    created_date: {
        type: Date,
        default: Date.now
    } 
});

module.exports = mongoose.model('Meeting', MeetingSchema);