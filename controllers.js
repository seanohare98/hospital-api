var Doctor = require('./models/doctor');
var Appointment = require('./models/appointment');
var Patient = require('./models/patient');

module.exports = {
  //alternative response format for GET doctors
  getNormalHours: function getNormalHours(doctor) {
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
  },

  //return day of week given Date.getDay()
  dayOfWeek: function dayOfWeek(dayIndex) {
    return ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][dayIndex];
  },

  //check for overlapping time ranges
  areOverlapping: function areOverlapping(a_start, a_end, b_start, b_end) {
    if (b_start < a_start) {
      return b_end > a_start;
    } else {
      return b_start < a_end;
    }
  },

  //compare 2 appointment times for overlap
  compareAppointments: function compareAppointments(
    appFoundDay,
    appFoundStart,
    appFoundEnd,
    dayOf,
    start,
    end
  ) {
    if (appFoundDay != null && appFoundStart != null && appFoundEnd != null) {
      console.log(appFoundDay, appFoundStart, appFoundEnd, dayOf, start, end);
      //algorithm for comparison using areOverlapping
      if (
        appFoundDay - dayOf == 0 &&
        module.exports.areOverlapping(appFoundStart, appFoundEnd, start, end)
      ) {
        console.log('REACHED FALSE RETURN');
        return false;
      } else {
        return true;
      }
    } else {
      console.log('NULL OBJECT RETURNED');
      return true;
    }
  },

  findApps: function findApps(ids) {
    return Appointment.find({
      _id: { $in: ids }
    }).exec();
  },

  //check appointment time against doctor's working hours and current appointments
  isValidAppointment: function isValidAppointment(
    doctor,
    dayOf,
    weekDay,
    start,
    end
  ) {
    const ids = doctor.appointments;
    var doctorObject = doctor.toObject(),
      isValid = false;

    //check for conflict with current appointment schedule
    return this.findApps(ids).then(data => {
      console.log(data);
      //check for conflict with doctor's working hours
      const hourEntries = Object.entries(doctorObject.hours);
      for (const [day, times] of hourEntries) {
        console.log(day, weekDay, times.open, times.close, start, end);
        if (day == weekDay && times.open < start && times.close > end) {
          isValid = true;
        }
      }
      console.log('isValid after doctor hours check is: ' + isValid);
      if (isValid == false) return false;
      else {
        for (var i = 0; i < data.length; i++) {
          isValid = module.exports.compareAppointments(
            data[i].day,
            data[i].start,
            data[i].end,
            dayOf,
            start,
            end
          );
          if (isValid == false) {
            console.log('so we return false...');
            console.log('isValid after appointment hours check is: ' + isValid);
            return false;
          }
        }
        console.log('isValid after appointment hours check is: ' + isValid);
        return true;
      }
    });
  }
};

/*
  findApp: function findApp(id, callback) {
    Appointment.findOne({ _id: id }, function(err, appObj) {
      if (err) {
        return callback(err);
      } else if (appObj) {
        return callback(null, appObj);
      } else {
        return callback();
      }
    });
  },
*/

/*
      doctor.appointments.forEach(function(app, index) {
        Appointment.findOne({ _id: app }).then(appFound => {
          isValid = module.exports.compareAppointments(
            appFound,
            dayOf,
            start,
            end
          );
          if (isValid == false) return false; //what to do after i've found isValid to be false
        });
      });*/
