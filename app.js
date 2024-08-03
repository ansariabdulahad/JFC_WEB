require('dotenv').config();

// THIRD PARTY MIDDLEWARES AND PACKAGES
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const multer = require('multer');

const multipart = multer().none();

// ROUTER LEVEL MIDDLEWARES REQUIRE
const indexRouter = require('./routes/index.routes');
const signupRouter = require('./routes/signup.routes');
const loginRouter = require('./routes/login.routes');
const logoutRouter = require('./routes/logout.routes');
const companyRouter = require('./routes/company.routes');
const userRouter = require('./routes/user.routes');
const profileRouter = require('./routes/profile.routes');
const studentsRouter = require('./routes/students.routes');
const teamsRouter = require('./routes/teams.routes');
const sendMailRouter = require('./routes/sendMail.routes');
const exportRouter = require('./routes/export.routes');
const tokenRouter = require('./routes/token.routes');
const premiumRouter = require('./routes/premium.routes');
const accessRouter = require('./routes/access.routes');
const pageNotFoundRouter = require('./routes/page-not-found.routes');
// SERVICES REQUIRE
const tokenService = require('./services/token.service');
// CONTROLLER REQUIRE
const authController = require('./controller/auth.controller');

const app = express();

// VIEW ENGINE SETUP
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(multipart);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ROUTE LEVEL MIDDLEWARE
app.use('/', indexRouter);

app.use('/api/signup', signupRouter);
app.use('/api/login', loginRouter);
app.use('/page-not-found', pageNotFoundRouter);

// IMPLIMENTING API SECURITY
app.use((req, res, next) => {
  const isVerified = tokenService.verifyToken(req);

  if (isVerified.isVerified) {
    next();
  }
  else {
    res.status(401).clearCookie("authToken").redirect("/");
  }
});

const authLogger = () => {
  return async (req, res, next) => {
    const isLogged = await authController.checkUserLogged(req, res);
    if (isLogged) {
      next();
    }
    else {
      res.clearCookie("authToken").redirect('/');
    }
  }
}

// PRIVATES ROUTES
app.use('/api/private/company', companyRouter);
app.use("/api/private/user", userRouter);

app.use('/students', studentsRouter);
app.use('/teams', teamsRouter);
app.use('/profile', authLogger(), profileRouter);
app.use('/sendMail', sendMailRouter);
app.use('/export-to-pdf', exportRouter);
app.use('/get-token', tokenRouter);
app.use('/access', accessRouter);
app.use('/premium', premiumRouter);
app.use('/logout', logoutRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
