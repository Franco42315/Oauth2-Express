var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
require('dotenv').config();  // Asegúrate de cargar las variables del .env

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./auth');  // Agrega el archivo auth.js para manejar la autenticación

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configurar sesiones
app.use(session({
  secret: process.env.SESSION_SECRET,  // Usa la variable de entorno SESSION_SECRET
  resave: false,
  saveUninitialized: true,
}));

// Agregar rutas de autenticación
app.use(authRouter);  // Este middleware se encarga de las rutas /auth y /auth/callback

// Usar las rutas existentes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


//Comando get:  Invoke-RestMethod -Uri http://localhost:3000/users
// Comando post: Invoke-WebRequest -Uri http://localhost:3000/users -Method POST -Headers @{ "Content-Type" = "application/json" } -Body '{"name": "John", "age": 30}'
