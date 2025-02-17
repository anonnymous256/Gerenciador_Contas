var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/agendamento', function(req, res, next) {
  res.render('agendamento', { title: 'Agendamento' });
});

module.exports = router;
