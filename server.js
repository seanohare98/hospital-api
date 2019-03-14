//set up==========================================================
var express = require('express');
var app = express();
var routes = require('./routes');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var populater = require('./populateDB');
mongoose.set('useFindAndModify', false);
mongoose.connect(
  'mongodb://localhost/luma-interview',
  {
    useNewUrlParser: true
  },
  function(err, database) {
    if (err) console.log(err);
    /* clear db
    var db = database;
    db.collection('doctors').drop();
    db.collection('appointments').drop();
    db.collection('patients').drop();*/
  }
);
//configuration====================================================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(routes);
var port = process.env.PORT || 3000;
//populater.populateDatabase();

//START SERVER
app.listen(port);
console.log('Using port: ' + port);
