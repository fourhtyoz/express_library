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
// grafana / sentry

import createError from 'http-errors';
import express, { json, urlencoded } from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import compression from 'compression'; // once nginx is setup wont be needed anymore
import { contentSecurityPolicy } from 'helmet';
import RateLimit from 'express-rate-limit';
import * as db from 'mongoose';

db.set('strictQuery', false)
const mongoDB = 'mongodb://127.0.0.1:27017/library'
main().catch((err) => console.log(err));

async function main() {
  await db.connect(mongoDB);
}

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import catalogRouter from './routes/catalog';

const app = express();

// view engine setup
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'pug');

// Set CSP headers to allow our Bootstrap and Jquery to be served
app.use(
  contentSecurityPolicy({
    directives: {
      'script-src': ['self', 'code.jquery.com', 'cdn.jsdelivr.net'],
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
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'public')));

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

export default app