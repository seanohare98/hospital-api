var Doctor = require('../models/doctor');

module.exports = {
  //alternative response format for GET doctors
  getNormalHours: function(doctor) {
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
};
