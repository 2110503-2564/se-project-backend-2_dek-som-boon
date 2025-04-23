const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  score: {
    type: Number,
    default:0,
    required: true,
    min: 0,
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value'
    }
  },
  comment: {
    type: String,
    default:"no comment",
    required: false,
    validate: {
      validator: function (value) {
        if (!value) return true;
        const wordCount = value.trim().split(/\s+/).length;
        return wordCount <= 250;
      },
      message: 'Comment must be 250 words or fewer'
    }
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  massageShop: {
    type: mongoose.Schema.ObjectId,
    ref: 'MassageShop',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Review', reviewSchema);
