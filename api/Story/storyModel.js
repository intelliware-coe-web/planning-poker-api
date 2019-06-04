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
    meeting: {
        type: Schema.Types.ObjectId,
        ref: 'Meeting',
        required: 'Story must have a meeting'
    },
    created_date: {
        type: Date,
        default: Date.now
    } 
});

module.exports = mongoose.model('Story', StorySchema);