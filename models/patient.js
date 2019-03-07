var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PatientSchema = new Schema({
  name: String,
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }]
});

var Patient = mongoose.model('Patient', PatientSchema);
module.exports = Patient;
