var express = require('express');
var router = express.Router();
var appServices = require('./appServices');
var Appointment = require('../models/appointment');
var Doctor = require('../models/doctor');
//================================================================
//Routes ending with /doctor/:doctor_id/appointments
router
  .route('/doctors/:doctor_id/appointments')

  //VIEW a doctor's APPOINTMENTS with GET http://localhost:3000/luma/doctors/:doctor_id/appointments
  .get(function(req, res) {
    Doctor.findById(req.params.doctor_id, function(err, doctor) {
      if (err) res.send(err);

      res.send(doctor.appointments);
    });
  })

  //CREATE a new appointment with POST http://localhost:3000/luma/docotrs/:doctor_id/appointments
  .post(function(req, res) {
    //YEAR-MONTH-DAY format for date
    var dayOf = new Date(
        req.body.day.substring(0, 4),
        parseInt(req.body.day.substring(5, 7)) - 1, //months count from 0-11, so subtract 1 from input
        req.body.day.substring(8, 10)
      ),
      start = req.body.start,
      end = req.body.end;

    //error-checking before calling appServices
    if (!dayOf || !start || !end) res.send('Enter all appointment properties!');
    //more error-checking
    if (end <= start) res.send("Appointment can't end before it starts!");

    var weekDay = appServices.dayOfWeek(dayOf);

    Doctor.findById(req.params.doctor_id, function(err, doctor) {
      //handle promise returning boolean from isValidAppointment by: creating new app if valid/return err if not
      appServices
        .isValidAppointment(doctor, dayOf, weekDay, start, end)
        .then(data => {
          if (data == true) {
            console.log('APPOINTMENT DEEMED VALID');
            var appointment = new Appointment({
              day: dayOf,
              start: req.body.start,
              end: req.body.end
            });

            appointment.save(function(err) {
              if (err) res.send(err);
            });

            Doctor.findOneAndUpdate(
              { _id: req.params.doctor_id },
              { $push: { appointments: appointment } },
              function(err) {
                if (err) res.send(err);
              }
            );
            res.send('Successfully Booked Appointment!');
          } else res.send('Failed...appointment times conflict');
        });
    });
  });

module.exports = router;
