'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StorySchema = new Schema({
    name: {
        type: String,
        required: 'Name is required'
    },
    description: [{
        type: String
    }],
    created_date: {
        type: Date,
        default: Date.now
    } 
});

module.exports = mongoose.model('Story', StorySchema);