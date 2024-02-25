// TODO:
// es module instead of commonjs
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
const RateLimit = require("express-rate-limit");
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
const mongoDB = 'mongodb://127.0.0.1:27017/library'
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoDB);
}

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const catalogRouter = require('./routes/catalog')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Set CSP headers to allow our Bootstrap and Jquery to be served
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  }),
);
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
// Apply rate limiter to all requests
app.use(limiter);
app.use(compression()); // Compress all routes
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter)
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