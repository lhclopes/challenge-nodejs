const mongoose = require('mongoose');

const Product = mongoose.model('Product', {
  _id: Number,
  name: String,
  stock: Number,
  reserved: Number,
  sold: Number,
});

module.exports = Product;
