const mongoose = require('mongoose');

const Reserve = mongoose.model('Reserve', {
  productId: Number,
  reservationToken: String,
});

module.exports = Reserve;
