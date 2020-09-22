const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  bname: {
    type: String,
    required: true
  },
  phoneno: {
    type: String,
    minlength: 11,
    maxlength: 11,
    required: true
  },
  addr: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const User = new mongoose.model('User', userSchema);

module.exports = User;
