var express = require('express');
var router = express.Router();
var logic = require('./controllers');
var Doctor = require('./models/doctor');
var Appointment = require('./models/appointment');
var Patient = require('./models/patient');
//API ROUTES
//=================================================================
//Routes ending with /doctors
router
  .route('/doctors')

  //CREATE a new doctor's NAME/HOURS with POST http://localhost:3000/luma/doctors
  .post(function(req, res) {
    var doctor = new Doctor();
    doctor.name = req.body.name;
    doctor.hours = req.body.hours;

    doctor.save(function(err) {
      if (err) res.send(err);

      res.json({ message: 'Doctor Created!' });
      console.log(doctor);
    });
  })

  //VIEW ALL doctors HOURS with GET http://localhost:3000/luma/doctors
  .get(function(req, res) {
    /*MORE READABLE RESPONSE
    Doctor.find(function(err, doctors) {
      if (err) res.send(err);

      var returnForm = '';
      doctors.forEach(function(doctor) {
        returnForm += '\n' + logic.getNormalHours(doctor);
      });
      res.send(returnForm);
    });*/

    Doctor.find()
      .lean()
      .exec(function(err, doctors) {
        return res.end(JSON.stringify(doctors));
      });
  });

//=================================================================
//Organize routes ending in /doctors/:doctor_id
router
  .route('/doctors/:doctor_id')

  //VIEW SINGLE doctor's HOURS/APPOINTMENTS with GET http://localhost:3000/luma/doctors/:doctor_id
  .get(function(req, res) {
    Doctor.findById(req.params.doctor_id, function(err, doctor) {
      if (err) res.send(err);

      res.send(doctor);
    });
  })

  //UPDATE SINGLE doctor's NAME/HOURS with PUT http://localhost:3000/luma/doctors/:doctor_id
  .put(function(req, res) {
    Doctor.findById(req.params.doctor_id, function(err, doctor) {
      if (err) res.send(err);

      doctor.name = req.body.name;
      doctor.hours = req.body.hours;

      doctor.save(function(err) {
        if (err) res.send(err);

        res.json({ message: 'Doctor Updated!' });
      });
    });
  })

  //DELETE SINGLE doctor with DELETE http://localhost:3000/luma/doctors/:doctor_id
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

//=================================================================
router
  .route('/doctors/:doctor_id/appointments')

  //CREATE a new appointment with POST http://localhost:3000/luma/docotrs/:doctor_id/appointments
  .post(function(req, res) {
    //20XX-XX-XX format for day...months start counting from 0
    var dayOf = new Date(
        req.body.day.substring(0, 4),
        parseInt(req.body.day.substring(5, 7)) - 1,
        req.body.day.substring(8, 10)
      ),
      start = req.body.start,
      end = req.body.end;

    var weekDay = logic.dayOfWeek(dayOf.getDay());

    Doctor.findById(req.params.doctor_id, function(err, doctor) {
      if (!dayOf || !start || !end) res.send('Enter all properties');

      logic
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
  })

  //VIEW SINGLE doctor's APPOINTMENTS with GET http://localhost:3000/luma/doctors/:doctor_id/appointments
  .get(function(req, res) {
    Doctor.findById(req.params.doctor_id, function(err, doctor) {
      if (err) res.send(err);

      res.send(doctor.appointments);
    });
  });
//=================================================================
router
  .route('/patients')

  //VIEW ALL patients with GET http://localhost:3000/luma/patients
  .get(function(req, res) {
    Patient.find()
      .lean()
      .exec(function(err, patients) {
        return res.send(JSON.stringify(patients));
      });
  })

  //CREATE a new patient with POST http://localhost:3000/luma/patients
  .post(function(req, res) {
    var patient = new Patient();
    patient.name = req.body.name;

    patient.save(function(err) {
      if (err) res.send(err);

      res.json({ message: 'Patient Created!' });
      console.log(patient);
    });
  });

//================================================================
router.get('/', function(req, res) {
  res.json({ message: 'Awaiting Orders...' });
});
//MIDDLEWARE
router.use(function(req, res, next) {
  console.log('==Middleware Called==');
  next();
});
//prefix requests with /luma
router.use('/luma', router);

module.exports = router;
