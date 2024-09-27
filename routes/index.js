var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const token = req.session.token;  // Obtén el token desde la sesión
  res.render('index', { 
    title: 'Express', 
    user: token ? { access_token: token } : null  // Pasar el token a la vista
  });
});

module.exports = router;
