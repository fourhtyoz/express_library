// TODO:
// api
// admin
// auth (jwt + any other popular auth model)
// users
// simple react front
// cascade delete on models
// comments + ratings
// turn js into ts
// setup nginx and https
// react + express testing
// dockerize
// ci/cd on github
// grafana + sentry

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require('compression')
const helmet = require("helmet");
const cors = require('cors')
const RateLimit = require("express-rate-limit");

// DB Setup
const mongoDB = 'mongodb://127.0.0.1:27017/library'
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
connectToDB()

async function connectToDB() {
  try {
    await mongoose.connect(mongoDB);
    console.log('Connected to DB')
  }
  catch (e) {
    console.error(e)
  }
}

// Routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const catalogRouter = require('./routes/catalog')

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(cors())
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  }),
);

// TODO: apply the rate limit to specific requests
app.use(RateLimit({windowMs: 1 * 60 * 1000, max: 20}));

// FIXME: wont be needed once nginx is setup
app.use(compression()); // Compress all routes
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter)

// Error handling
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;