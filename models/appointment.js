var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AppointmentSchema = new Schema({
  day: String, //could use date and do math so appointments can be not restricted a single week
  start: Number,
  end: Number
});

var Appointment = mongoose.model('Appointment', AppointmentSchema);
module.exports = Appointment;
