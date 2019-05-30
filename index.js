'use strict';
const nconf = require('nconf');
nconf.argv().env().file('keys.json');

var express = require('express'),
  cors = require('cors'),
  app = express(),
  port = process.env.PORT || 9000,
  mongoose = require('mongoose'),
  User = require('./api/User/userModel'), //created model loading here
  Meeting = require('./api/Meeting/meetingModel'), 
  Story = require('./api/Story/storyModel'),
  bodyParser = require('body-parser');
  
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
const host = nconf.get('mongoHost');
const user = nconf.get('mongoUser');
const password = nconf.get('mongoPassword');
const mongoDBUri = `mongodb+srv://${user}:${password}@${host}/test?retryWrites=true`;
mongoose.connect(mongoDBUri, { useFindAndModify: false, useNewUrlParser: true }); 

var corsOptions = {
  origin: ['https://intelliware-coe-web.github.io','http://localhost:3000'],
  methods: 'GET,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var meetingRoutes = require('./api/Meeting/meetingRoutes'),
    userRoutes = require('./api/User/userRoutes'); //importing route
userRoutes(app); //register the route
meetingRoutes(app);

app.listen(port, () => {
  console.log('Planning Poker API server started on: ' + port);
});

module.exports = app;