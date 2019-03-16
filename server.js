//Setup==========================================================
var express = require('express');
var app = express();
var indexRoutes = require('./routes/indexRoutes');
var doctorRoutes = require('./routes/doctorRoutes');
var patientRoutes = require('./routes/patientRoutes');
var appRoutes = require('./routes/appRoutes');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var populater = require('./populateDB');
var mongoDB = 'mongodb://localhost/luma-interview';
var port = process.env.PORT || 3000;
mongoose.set('useFindAndModify', false);
mongoose.connect(
  mongoDB,
  {
    useNewUrlParser: true
  },
  function(err, database) {
    if (err) console.log(err);
    // CLEAR DATABASE HERE
    /*
    var db = database;
    db.collection('doctors').drop();
    db.collection('appointments').drop();
    db.collection('patients').drop();
    */
  }
);
//Config==========================================================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(indexRoutes);
app.use(doctorRoutes);
app.use(patientRoutes);
app.use(appRoutes);
//populater.populateDatabase(); //populate mongoDB with examples
//=================================================================
//START SERVER
app.listen(port);
console.log('Using port: ' + port);
