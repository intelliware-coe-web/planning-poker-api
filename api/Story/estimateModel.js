'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let EstimateSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
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