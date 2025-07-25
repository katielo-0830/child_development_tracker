var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const therapistRoutes = require('./routes/therapists'); // Adjust path if necessary
const sessionRoutes = require('./routes/sessions'); // Import the sessions router
const programRoutes = require('./routes/programs'); // Import the programs router
const stosRoutes = require('./routes/stos'); // Import the stos router

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/therapists', therapistRoutes); // All routes in therapists.js will be prefixed with /api/therapists
app.use('/api/sessions', sessionRoutes); // All routes in sessions.js will be prefixed with /api/sessions
app.use('/api/programs', programRoutes); // All routes in programs.js will be prefixed with /api/programs
app.use('/api/stos', stosRoutes); // All routes in stos.js will be prefixed with /api/stos

module.exports = app;
