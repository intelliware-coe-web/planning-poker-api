'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let EstimateSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: 'You need a user'
    },
    estimate: {
        type: Number
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Estimate', EstimateSchema);