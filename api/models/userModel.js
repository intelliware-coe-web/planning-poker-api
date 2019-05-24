'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
  name: {
    type: String,
    required: 'You need a name to exist'
  },
  Created_date: {
    type: Date,
    default: Date.now
  }  
});

module.exports = mongoose.model('Users', UserSchema);