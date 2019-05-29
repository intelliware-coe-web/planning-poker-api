var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../../index.js');
var Meeting = require('../models/meetingModel');

// Configure chai
chai.use(chaiHttp);
chai.should(); 

// describe('GET /meetings', function() {
//     it('should return all meetings', function(done) {
//         chai.request(app)
//             .get('/meetings')
//             .end((err, res) => {
//                 res.should.have.status(200);
//                 res.body.should.be.a('array');
//                 done();
//             });
//     });
// });