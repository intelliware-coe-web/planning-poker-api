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
        type: Schema.Types.ObjectId,
        ref: 'Estimate'
    }],
    created_date: {
        type: Date,
        default: Date.now
    } 
});

module.exports = mongoose.model('Story', StorySchema);