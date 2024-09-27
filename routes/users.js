var express = require('express');
var router = express.Router();

// Middleware para proteger la ruta con el token en el encabezado Authorization
function ensureAuthenticated(req, res, next) {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    // El token debe estar en formato "Bearer <token>"
    const bearerToken = bearerHeader.split(' ')[1];
    
    if (bearerToken === req.session.token) {
      // Si el token es válido, continúa
      next();
    } else {
      res.status(403).json({ message: 'Invalid token' });
    }
  } else {
    // Si no hay token, redirigir al login
    res.redirect('/auth');
  }
}



/* GET users listing, protegido por autenticación */
router.get('/', ensureAuthenticated, function(req, res, next) {
  res.send('Access granted to protected resource');
});

/* Nueva ruta POST para agregar datos */
router.post('/', ensureAuthenticated, function(req, res, next) {
  const data = req.body;  // Aquí recibirás los datos enviados en la solicitud POST
  // Aquí podrías hacer algo con los datos, como guardarlos en la base de datos
  console.log(data);

  res.status(201).send({ message: 'Data received', data });
});

module.exports = router;
