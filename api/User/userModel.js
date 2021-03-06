'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let UserSchema = new Schema({
  name: {
    type: String,
    required: 'You need a name to exist',
    trim: true
  },
  created_date: {
    type: Date,
    default: Date.now
  }  
});

module.exports = mongoose.model('User', UserSchema);