'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let MeetingSchema = new Schema({
    name: {
        type: String,
        required: 'Name is required'
    },
    host: String,
    current_story: {
        type: Schema.Types.ObjectId,
        ref: 'Story'
    },
    created_date: {
        type: Date,
        default: Date.now
    } 
});

module.exports = mongoose.model('Meeting', MeetingSchema);