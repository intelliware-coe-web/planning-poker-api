'use strict';
const nconf = require('nconf');
nconf.argv().env().file('keys.json');

let express = require('express'),
  cors = require('cors'),
  app = express(),
  port = process.env.PORT || 9000,
  mongoose = require('mongoose'),
  bodyParser = require('body-parser');

// Load Models
let User = require('./api/User/userModel'), 
  Meeting = require('./api/Meeting/meetingModel'), 
  Story = require('./api/Story/storyModel');
  
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
const host = nconf.get('mongoHost');
const user = nconf.get('mongoUser');
const password = nconf.get('mongoPassword');
const mongoDBUri = `mongodb+srv://${user}:${password}@${host}/test?retryWrites=true`;
mongoose.connect(mongoDBUri, { useFindAndModify: false, useNewUrlParser: true }); 

let corsOptions = {
  origin: ['https://intelliware-coe-web.github.io','http://localhost:3000'],
  methods: 'GET,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Register the routes
let meetingRoutes = require('./api/Meeting/meetingRoutes'),
    storyRoutes = require('./api/Story/storyRoutes'),
    userRoutes = require('./api/User/userRoutes');
meetingRoutes(app);
storyRoutes(app);
userRoutes(app); 

app.listen(port, () => {
  console.log('Planning Poker API server started on: ' + port);
});

module.exports = app;