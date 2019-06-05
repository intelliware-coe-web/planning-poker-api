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
    estimates: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: 'User is required'
        },
        estimate: {
            type: Number
        }
    }]
});

module.exports = mongoose.model('Story', StorySchema);