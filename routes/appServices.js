var Doctor = require('../models/doctor');
var Appointment = require('../models/appointment');

module.exports = {
  //return string representing day of week of a Date
  dayOfWeek: function(dayOf) {
    return ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][dayOf.getDay()];
  },

  //check for overlapping time ranges (called by compareAppointments)
  areOverlapping: function(a_start, a_end, b_start, b_end) {
    if (b_start < a_start) {
      return b_end > a_start;
    } else {
      return b_start < a_end;
    }
  },

  //compare 2 appointment times for overlap
  compareAppointments: function(
    appFoundDay,
    appFoundStart,
    appFoundEnd,
    dayOf,
    start,
    end
  ) {
    if (appFoundDay != null && appFoundStart != null && appFoundEnd != null) {
      console.log(appFoundDay, appFoundStart, appFoundEnd, dayOf, start, end);
      //comparison algorithm using areOverlapping
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

  //mongoose query to find all relevant data to be handled in isValidAppointment, return promise returning array
  findApps: function findApps(ids) {
    return Appointment.find({
      _id: { $in: ids }
    }).exec();
  },

  //check appointment validity against doctor's working hours and current appointments
  //return a promise that returns a boolean isValidAppointment (true if valid/false if invalid)
  isValidAppointment: function(doctor, dayOf, weekDay, start, end) {
    const ids = doctor.appointments;
    var doctorObject = doctor.toObject(),
      isValid = false;

    //check for conflict with current appointment schedule
    return this.findApps(ids).then(data => {
      console.log(data);
      //first check for conflict with doctor's working hours
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
