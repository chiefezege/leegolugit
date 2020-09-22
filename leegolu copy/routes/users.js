const express = require('express');
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const User = require('../models/models');
const passport = require('passport')

const router = express.Router();

const app = express();

//

// bodyParser
const urlencoderParser = bodyParser.urlencoded({ extended: true });

// login page
router.get('/login', (req, res) =>{
  res.render('login')
})


// registration page
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', urlencoderParser, (req, res) => {
  const { bname, phoneno, addr, password, confirmpassword } = req.body;
  console.log(req.body);
  let errors = [];

  if ( !bname || !phoneno || !addr || !password || !confirmpassword){
    errors.push({ msg: "Please fill in all fields"})
    res.render('register', {
      bname,
      phoneno
    });
  }

  if( password !== confirmpassword){
    errors.push({ msg: "Passwords do not match" })
  }

  if( password.length < 6 ){
    errors.push({ msg: "Password must be atleast 6 characters"})
  }

  if( errors.length > 0){
    res.render('register', {
      errors, 
      bname,
      phoneno, 
      addr,
      password,
      confirmpassword
    })
  } else {
    User.findOne({  phoneno: phoneno })
      .then((user) => {
        if(user){
          errors.push({msg: "user already exists"});
          res.render('register', {
            errors, 
            bname,
            phoneno, 
            addr
          })
        } else {
          newUser = User({
            bname,
            phoneno, 
            addr,
            password,
            confirmpassword
          })
          
          bcrypt.genSalt(10, (err, salt) => 
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err) throw err;

              newUser.password = hash;

              newUser.save()
                .then((user) =>{
                  req.flash('success_msg', "You can now login")
                  res.redirect('/login');
                })
                .catch((err) => {
                  console.log(err);
                })
            })
          )
        }
      })
  }
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/dashboard',
    failureFlash: true
  }) (req, res, next);
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/login')
})

module.exports = router;