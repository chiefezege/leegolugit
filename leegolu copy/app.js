const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const chalk = require('chalk');
const morgan = require('morgan');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('./config/passport');

// initializing express
const app = express();

// passport config
require('./config/passport')(passport);

// require route
const router = require('./routes/users');


//
const db = require('./config/db').MongoURI

// connect db
mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then((result) =>
    console.log('MongoDB connected'))
  .catch((err) =>
    console.log(err))
// ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');

// express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

// passport middleware
router.use(passport.initialize());
router.use(passport.session());


// flash
app.use(flash());

// global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next()
})

// set layouts
app.set('layout');

// use route
app.use('/', router);

//set morgan 
if (process.env.NODE_ENV === "development") {
  app.use(morgan('dev'));
}

//Port
const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${chalk.green(port)}`);
})