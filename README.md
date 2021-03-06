# hospital-api
REST API for simulated hospital functionality

======================================================================================

API Endpoints:

[{ //DOCTOR ROUTES: CREATE, READ (all or individual), UPDATE, DESTROY

“methods”: [“GET”], “route”: [“/doctors”], 
“description”: “returns JSON list of all the doctors (their working hours, appointment ids, and names)”,

“methods”: [“POST”], “route”: [“/doctors”], 
“description”: “create a new doctor”, 
“supportedParameters” : { “name” : “String designating the name of the doctor”, “hours”: “Object with format in Doctor schema found in models/doctor.js”},

“methods”: [“GET”], “route”: [“/doctors/:doctor_id”], 
“description”: “returns JSON of doctor with matching :doctor_id (their working hours, appointment ids, and name)”,

“methods”: [“PUT”], “route”: [“/doctors/:doctor_id”], 
“description”: “update a doctor with matching :doctor_id (their working hours, and name)”,

“methods”: [“PUT”], “route”: [“/doctors/:doctor_id”], 
“description”: “update a doctor with matching :doctor_id (their working hours, and name)”,

“methods”: [“DELETE”], “route”: [“/doctors/:doctor_id”], 
“description”: “delete a doctor with matching :doctor_id”,

//APPOINTMENT ROUTES: CREATE, READ

“methods”: [“GET”], “route”: [“/doctors/:doctor_id/appointments”], 
“description”: “returns a list of appointment ids for the doctor with matching :doctor_id”,

“methods”: [“POST”], “route”: [“/doctors/:doctor_id/appointments”], 
“description”: “create/book a new appointment”, 
“supportedParameters” : { “day” : “Date object designating date of appointment”, “start”: “Number between 0-1440 indicating minute of day the appointment starts”, “end”: “Number between 0-1440 indicating minute of day the appointment ends”},

//PATIENT ROUTES: CREATE, READ, DELETE

“methods”: [“GET”], “route”: [“/patients”], 
“description”: “returns JSON list of all the patients (their appointment ids and names)”,

“methods”: [“POST”], “route”: [“/patients”], 
“description”: “create a new patient”,
“supportedParameters” : { “name” : “String designating the name of the patient”},

“methods”: [“DELETE”], “route”: [“/patients/:patient_id”], 
“description”: “delete a patient with matching :patient_id” 
}]
