//populate database with example models
var Doctor = require('./models/doctor');
var Appointment = require('./models/appointment');
var Patient = require('./models/patient');

module.exports = {
  populateDatabase: function() {
    var date1 = new Date(2019, 03, 06),
      date2 = new Date(2019, 04, 06),
      date3 = new Date(2019, 01, 06);
    var newApp1 = new Appointment({
      day: date1,
      start: 660,
      end: 720
    });

    var newApp2 = new Appointment({
      day: date2,
      start: 720,
      end: 780
    });

    var newApp3 = new Appointment({
      day: date3,
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
  }
};
