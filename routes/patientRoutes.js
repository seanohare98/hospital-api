var express = require('express');
var router = express.Router();
var common = require('./common');
var Patient = require('../models/patient');
//================================================================
//Routes ending with /patients
router
  .route('/patients')

  //VIEW ALL patients with GET http://localhost:3000/hospital/patients
  .get(function(req, res) {
    Patient.find()
      .lean()
      .exec(function(err, patients) {
        return res.send(JSON.stringify(patients));
      });
  })

  //CREATE a new patient with POST http://localhost:3000/hospital/patients
  .post(function(req, res) {
    var patient = new Patient();
    patient.name = req.body.name;

    patient.save(function(err) {
      if (err) res.send(err);

      res.json({ message: 'Patient Created!' });
      console.log(patient);
    });
  });

//DELETE a patient with DELETE http://localhost:3000/hospital/patients/:patient_id
router.delete('/patients/:patient_id', function(req, res) {
  Patient.remove(
    {
      _id: req.params.patient_id
    },
    function(err, patient) {
      if (err) res.send(err);

      res.json({ message: 'Successfully Deleted!' });
    }
  );
});

//Prefix requests with /hospital
router.use('/hospital', router);

module.exports = router;
