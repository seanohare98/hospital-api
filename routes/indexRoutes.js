var express = require('express');
var router = express.Router();

//=================================================================
router.get('/', function(req, res, next) {
  res.json({ message: 'Awaiting Orders...' });
});

//MIDDLEWARE
router.use(function(req, res, next) {
  console.log('==Middleware Called==');
  next();
});

module.exports = router;
