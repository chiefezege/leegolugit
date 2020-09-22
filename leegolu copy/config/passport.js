const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// load User models
const User = require('../models/models');

module.exports = function (passport) => {
  console.log(module.exports(passport))
  passport.use(
    new localStrategy({ usernameField: 'phoneno' }, (phoneno, password, done) => {
      User.findOne({ phoneno: phoneno })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: "user is not registered" })
          }

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
              return (null, user);
            } else {
              return done(null, false, { message: "Password is incorrect" })
            }
          })
        })
        .catch((err) => {
          console.log(err);
        })
    })
  )
  // serialize user
  passport.serializeUser((user, done) => {
    done(null, user.id)
  });

  // deserialize user
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    })
  })
}