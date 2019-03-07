var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DoctorSchema = new Schema({
  name: String,
  //doctor's working hours will use numbers ranging from 0-1440 to represent each minute in a day
  hours: {
    mon: { open: Number, close: Number },
    tue: { open: Number, close: Number },
    wed: { open: Number, close: Number },
    thu: { open: Number, close: Number },
    fri: { open: Number, close: Number },
    sat: { open: Number, close: Number },
    sun: { open: Number, close: Number }
  },
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }]
});

var Doctor = mongoose.model('Doctor', DoctorSchema);
module.exports = Doctor;
