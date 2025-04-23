const mongoose = require('mongoose');

const TherapistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters']
  },
  tel: {
    type: String,
    required: [true, 'Please add a telephone number']
  },
  age: {
    type: Number,
    required: [true, 'Please add age'],
    min: [18, 'Therapist must be at least 18 years old']
  },
  sex: {
    type: String,
    enum: ['male', 'female', 'gay','queer','lesbian','bisexual','other'],
    required: [true, 'Please specify sex']
  },
  specialty: {
    type: [String],
    validate: [
      {
        validator: function (value) {
          return value.length >= 1 && value.length <= 5;
        },
        message: 'Specialty must have between 1 and 5 items'
      }
    ],
    required: [true, 'Please provide at least one specialty']
  },
  available: {
    type: [String],
    enum: {
      values: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      message: '{VALUE} is not a valid day'
    },
    validate: [
      {
        validator: function (value) {
          return value.length >= 1 && value.length <= 7;
        },
        message: 'Available days must be between 1 and 7'
      }
    ],
    required: [true, 'Please provide at least one available day']
  },
  massageShop: {
    type: mongoose.Schema.ObjectId,
    ref: 'MassageShop',
    required: true
  }
});

module.exports = mongoose.model('Therapist', TherapistSchema);
