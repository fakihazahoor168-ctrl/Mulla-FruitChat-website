const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const MenuItemSchema = new mongoose.Schema({
  nameEnglish: {
    type: String,
    required: true,
    trim: true
  },
  nameUrdu: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: function() {
      return !this.sizes || Object.keys(this.sizes).length === 0;
    }
  },
  sizes: {
    type: Map,
    of: Number,
    default: {}
  },
  image: {
    type: String,
    default: ''
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isSpecial: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 5.0
  },
  numReviews: {
    type: Number,
    default: 1
  },
  reviews: [ReviewSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);
