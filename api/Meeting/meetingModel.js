'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let MeetingSchema = new Schema({
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
        name: {
            type: String,
            required: 'Name is required'
        },
        description: {
            type: String
        },
        estimates: [{
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: 'You need a user'
            },
            estimate: {
                type: Number
            }
        }]
    }],
    created_date: {
        type: Date,
        default: Date.now
    } 
});

module.exports = mongoose.model('Meeting', MeetingSchema);