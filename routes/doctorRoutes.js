var express = require('express');
var router = express.Router();
var common = require('./common');
var Doctor = require('../models/doctor');
//================================================================
//Routes ending with /doctors
router
  .route('/doctors')

  //VIEW ALL doctors HOURS with GET http://localhost:3000/luma/doctors
  .get(function(req, res) {
    //Use to call more readable response format
    /*
    Doctor.find(function(err, doctors) {
      if (err) res.send(err);

      var returnForm = '';
      doctors.forEach(function(doctor) {
        if (doctor) returnForm += '\n' + common.getNormalHours(doctor);
      });
      res.send(returnForm);
    });
    */

    Doctor.find()
      .lean()
      .exec(function(err, doctors) {
        return res.end(JSON.stringify(doctors));
      });
  })

  //CREATE a new doctor's with POST http://localhost:3000/luma/doctors
  .post(function(req, res) {
    var doctor = new Doctor();
    doctor.name = req.body.name;
    doctor.hours = req.body.hours;
    doctor.save(function(err) {
      if (err) res.send(err);

      res.json({ message: 'Doctor Created!' });
      console.log(doctor);
    });
  });

//=================================================================
//Routes ending with /doctors/:doctor_id
router
  .route('/doctors/:doctor_id')

  //VIEW a doctor's NAME/HOURS/APPOINTMENTS with GET http://localhost:3000/luma/doctors/:doctor_id
  .get(function(req, res) {
    Doctor.findById(req.params.doctor_id, function(err, doctor) {
      if (err) res.send(err);

      res.send(doctor);
    });
  })

  //UPDATE a doctor's NAME/HOURS with PUT http://localhost:3000/luma/doctors/:doctor_id
  .put(function(req, res) {
    Doctor.findById(req.params.doctor_id, function(err, doctor) {
      if (err) res.send(err);

      doctor.name = req.body.name;
      doctor.hours = req.body.hours;

      doctor.save(function(err) {
        if (err) res.send(err);

        res.json({
          message: 'Doctor Updated!'
        });
      });
    });
  })

  //DELETE a doctor with DELETE http://localhost:3000/luma/doctors/:doctor_id
  .delete(function(req, res) {
    Doctor.remove(
      {
        _id: req.params.doctor_id
      },
      function(err, doctor) {
        if (err) res.send(err);

        res.json({ message: 'Successfully Deleted!' });
      }
    );
  });

module.exports = router;
