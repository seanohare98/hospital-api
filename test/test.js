const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
var Doctor = require('../models/doctor');
const areOverlapping = require('../routes/appServices').areOverlapping;
const dayOfWeek = require('../routes/appServices').dayOfWeek;
const compareAppointments = require('../routes/appServices')
  .compareAppointments;
var testDate1 = new Date(2019, 02, 11); //march 11, 2019
var testDate2 = new Date(2019, 02, 11); //march 11, 2019

//=================================================================
//Test case for dayOfWeek()
describe('dayOfWeek', function() {
  it('dayOfWeek() should return monday as testDate1 is a monday', function() {
    dayOfWeek(testDate1).should.equal('mon'); //March 11, 2019 is a monday
  });
});
//=================================================================
//Test edge cases for areOverlapping()
describe('areOverlapping', function() {
  it('areOverlapping() should return false as back-to-back bookings are allowed', function() {
    areOverlapping(610, 660, 660, 670).should.equal(false); //app1 ends: 660, app2 starts: 660
  });

  it('areOverlapping() should return true as appointment b starts 1 min before appointment a ends', function() {
    areOverlapping(610, 660, 659, 670).should.equal(true); //app1 ends: 660, app2 starts: 659
  });
});
//=================================================================
//Test cases for compareAppointments()
describe('compareAppointments', function() {
  it('compareAppointments() should return true as back-to-back bookings are allowed', function() {
    compareAppointments(testDate1, 610, 660, testDate2, 660, 670).should.equal(
      true
    ); //extension of areOverlapping test
  });

  it('compareAppointments() should return false as appointment b starts 1 min before appointment a ends', function() {
    compareAppointments(testDate1, 610, 660, testDate2, 659, 670).should.equal(
      false
    ); //extension of areOverlapping test
  });
});
//=================================================================
describe('Appointments', function() {
  it('All Appontments should have a Date, and 2 Numbers representing start/end time', function() {
    compareAppointments(testDate1, 610, 660, testDate2, 660, 670).should.equal(
      true
    ); //similar test to areOverlapping
  });
});
