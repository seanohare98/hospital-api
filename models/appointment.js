var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AppointmentSchema = new Schema({
  day: Date,
  start: Number,
  end: Number
});

var Appointment = mongoose.model('Appointment', AppointmentSchema);
module.exports = Appointment;
