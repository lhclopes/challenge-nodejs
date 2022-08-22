const Product = require('../models/Product');

class ProductService {
  constructor() {}

  async maxProductId() {
    const products = await Product.findOne().sort({ _id: -1 }).limit(1);

    let id = 1 + Number(products._id);
    return id;
  }

  newProduct(id) {
    var _id = id;
    var name = '?';
    var stock = 0;
    var reserved = 0;
    var sold = 0;

    const product = { _id, name, stock, reserved, sold };

    return product;
  }
}

module.exports = ProductService;
