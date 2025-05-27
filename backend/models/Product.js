const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  typeId: {
    type: String,
    required: true
  },
  flavorId: [{
    type: String
  }],
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['цукерки', 'шоколад', 'печиво', 'подарункові набори', 'інше']
  },
  weight: {
    type: Number,
    required: true,
    min: 0
  },
  inStock: {
    type: Boolean,
    default: true
  },
  ingredients: {
    type: String,
    required: true
  },
  nutritionalValue: {
    calories: Number,
    proteins: Number,
    fats: Number,
    carbohydrates: Number
  },
  isNew: {
    type: Boolean,
    default: false
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product; 