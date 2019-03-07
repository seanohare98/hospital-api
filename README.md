# hospital-api
REST API for hospital appointment scheduling

Data Model
Define a set of data models that include:
•	a way track assign booked appointments
•	a way to track patients
•	a way to track doctors
•	a way to track a doctor's working hours and days
REST API
Implement the following functionality:
•	Find a doctor's working hours
•	Book an doctor opening
•	Create and update the list of doctor's working hours
==============================================================================

//CREATE a new doctor with POST http://localhost:3000/luma/doctors

//VIEW ALL doctors with GET http://localhost:3000/luma/doctors

//VIEW a doctor/working hours with GET http://localhost:3000/luma/doctors/:doctor_id

//UPDATE a doctor/working hours with PUT http://localhost:3000/luma/doctors/:doctor_id

//DELETE a doctor with DELETE http://localhost:3000/luma/doctors/:doctor_id

//CREATE/book a new appointment with POST http://localhost:3000/luma/docotrs/:doctor_id/appointments

//VIEW a doctor's APPOINTMENTS with GET http://localhost:3000/luma/doctors/:doctor_id/appointments

//VIEW ALL patients with GET http://localhost:3000/luma/patients

//CREATE a new patient with POST http://localhost:3000/luma/patients

