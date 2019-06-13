'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let StorySchema = new Schema({
    name: {
        type: String,
        required: 'Name is required'
    },
    description: {
        type: String
    },
    meetingId: {
        type: Schema.Types.ObjectId,
        ref: 'Meeting',
        required: 'Meeting Id is required'
    },
    estimates: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        estimate: {
            type: Number
        }
    }],
    estimate_avg: {
        type: Number
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Story', StorySchema);