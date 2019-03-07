//call packages
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
//supplemental variables
var db,
  daysOfWeek = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
//connect to local database
mongoose.connect(
  'mongodb://localhost/luma-interview',
  {
    useNewUrlParser: true
  },
  function(err, database) {
    if (err) console.log(err);

    db = database;
    /* db.collection('doctors').drop();
    db.collection('appointments').drop();
    db.collection('patients').drop(); */
  }
);

//configure bodyParser so we can get data from requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//set port
var port = process.env.PORT || 3000;

//require models
var Doctor = require('./models/doctor');
var Appointment = require('./models/appointment');
var Patient = require('./models/patient');

//check appointment time against doctor's working hours (no check against other appointments)
function isValidAppointment(doctor, dayOf, start, end) {
  var doctorObject = doctor.toObject(),
    isValid = false;
  const hourEntries = Object.entries(doctorObject.hours);
  for (const [day, times] of hourEntries) {
    if (day == dayOf && times.open < start && times.close > end) {
      return true;
    }
  }
  return isValid;
}
//ALTERNATIVE RESPONSE FORMAT
function getNormalHours(doctor) {
  var returnForm = 'NORMAL WORKING HOURS for Dr. ' + doctor.name + '\n';
  var doctorObject = doctor.toObject();
  const hourEntries = Object.entries(doctorObject.hours);
  for (const [day, times] of hourEntries) {
    if ((times.open % 60).toString().length < 2) var preMinOpen = '0';
    else var preMinOpen = '';
    if ((times.close % 60).toString().length < 2) var preMinClose = '0';
    else var preMinClose = '';
    returnForm +=
      day +
      ': open: ' +
      parseInt(times.open / 60) +
      ':' +
      preMinOpen +
      (times.open % 60) +
      ', close: ' +
      parseInt(times.close / 60) +
      ':' +
      preMinClose +
      (times.close % 60) +
      '\n';
  }
  return returnForm;
}

//populate database with example models
/*
var newApp1 = new Appointment({
  day: 'mon',
  start: 660,
  end: 720
});

var newApp2 = new Appointment({
  day: 'wed',
  start: 720,
  end: 780
});

var newApp3 = new Appointment({
  day: 'thu',
  start: 600,
  end: 720
});

newApp1.save();
newApp2.save();
newApp3.save();

var newDoc1 = new Doctor({
  name: 'Jeff Bezos',
  hours: {
    mon: { open: 570, close: 1080 },
    tue: { open: 570, close: 1080 },
    wed: { open: 570, close: 1080 },
    thu: { open: 570, close: 1080 },
    fri: { open: 570, close: 1020 },
    sat: { open: 790, close: 1020 },
    sun: { open: 790, close: 1020 }
  },
  appointments: [newApp1]
});

var newDoc2 = new Doctor({
  name: 'Bill Gates',
  hours: {
    mon: { open: 790, close: 960 },
    tue: { open: 790, close: 960 },
    wed: { open: 790, close: 960 },
    thu: { open: 790, close: 960 },
    fri: { open: 790, close: 960 },
    sat: { open: 570, close: 960 },
    sun: { open: 570, close: 960 }
  },
  appointments: [newApp2]
});

var newDoc3 = new Doctor({
  name: 'Mark Zuckerberg',
  hours: {
    mon: { open: 360, close: 870 },
    tue: { open: 360, close: 870 },
    wed: { open: 360, close: 870 },
    thu: { open: 360, close: 870 },
    fri: { open: 360, close: 870 },
    sat: { open: 360, close: 870 },
    sun: { open: 360, close: 870 }
  },
  appointments: [newApp3]
});

newDoc1.save();
newDoc2.save();
newDoc3.save();

var newPat1 = new Patient({
  name: 'Elon Musk',
  appointments: [newApp1]
});

var newPat2 = new Patient({
  name: 'Linus Torvalds',
  appointments: [newApp2]
});

var newPat3 = new Patient({
  name: 'Andrew Jassy',
  appointments: [newApp3]
});

newPat1.save();
newPat2.save();
newPat3.save();
*/
//API ROUTES
//========================================================
var router = express.Router(); //instance of express Router

//MIDDLEWARE
router.use(function(req, res, next) {
  console.log('Middleware Called');
  next();
});

//==========================================
//Organize routes ending with /doctors
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
    /* MORE READABLE RESPONSE
    Doctor.find(function(err, doctors) {
      if (err) res.send(err);
  
      var returnForm = '';
      doctors.forEach(function(doctor) {
        returnForm += '\n' + getNormalHours(doctor);
      });
      res.send(returnForm);
    });*/

    Doctor.find()
      .lean()
      .exec(function(err, doctors) {
        return res.end(JSON.stringify(doctors));
      });
  });

//=============================================
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

//===============================================================
router
  .route('/doctors/:doctor_id/appointments')

  //CREATE a new appointment with POST http://localhost:3000/luma/docotrs/:doctor_id/appointments
  .post(function(req, res) {
    var dayOf = req.body.day,
      start = req.body.start,
      end = req.body.end;

    Doctor.findById(req.params.doctor_id, function(err, doctor) {
      if (!dayOf || !start || !end) res.send('Enter all properties');
      if (isValidAppointment(doctor, dayOf, start, end)) {
        var appointment = new Appointment({
          day: req.body.day,
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
            if (err) console.log(err);
          }
        );

        res.send('Successfully Booked Appointment!');
      }
      res.send('Failed...appointment times conflict');
    });
  })

  //VIEW SINGLE doctor's APPOINTMENTS with GET http://localhost:3000/luma/doctors/:doctor_id/appointments
  .get(function(req, res) {
    Doctor.findById(req.params.doctor_id, function(err, doctor) {
      if (err) res.send(err);

      res.send(doctor.appointments);
    });
  });
//================================================================
router
  .route('/patients')

  //VIEW ALL patients with GET http://localhost:3000/luma/patients
  .get(function(req, res) {
    Patient.find()
      .lean()
      .exec(function(err, patients) {
        return res.end(JSON.stringify(patients));
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

//prefix requests with /luma
app.use('/luma', router);

//START SERVER
//========================================================
app.listen(port);
console.log('Using port: ' + port);
