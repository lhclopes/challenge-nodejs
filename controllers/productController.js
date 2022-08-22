const Product = require('../models/Product');
const Reserve = require('../models/Reserve');

const ProductService = require('../services/productService');

var productService = new ProductService();

const adicionar = async (req, res, next) => {
  var _id = await productService.maxProductId();
  var name = 'Phone';
  var stock = 10;
  var reserved = 0;
  var sold = 0;

  const product = { _id, name, stock, reserved, sold };

  await Product.create(product);

  res.status(200).json('Adicionado');
};

const listar = async (req, res, next) => {
  try {
    const products = await Product.find();

    res.status(200).json(products);
  } catch (error) {
    res.status(400).json(error);
  }
};

const buscar = async (req, res, next) => {
  const id = req.params.id;

  try {
    const product = await Product.findOne({ _id: id });

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json(error);
  }
};

//
// EndPoint 1
//
//Retorno
//Caso o Produto Exista
// HTTP 200 + JSON: {"stock": 123}
//Caso nao exista cria um produto e o coloca como estoque 0
const getStock = async (req, res, next) => {
  const id = req.params.id;

  try {
    const product = await Product.findOne({ _id: id });

    if (product != null) {
      res.status(200).json({ stock: product.stock });
    } else {
      const newProduct = productService.newProduct(id);

      await Product.create(newProduct);

      res.status(200).json({ stock: newProduct.stock });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

//
// EndPoint 2
//
//Retorno:
//Caso o produto Exista
// HTTP 200 + JSON: {"IN_STOCK": 123, "RESERVED": 4, "SOLD": 12}
//Caso o produto não exista
// HTTP 404
const getProduct = async (req, res, next) => {
  const id = req.params.id;

  try {
    const product = await Product.findOne({ _id: id });

    if (product != null) {
      res.status(200).json({
        IN_STOCK: product.stock,
        RESERVED: product.reserved,
        SOLD: product.sold,
      });
    } else {
      res.status(404).json('');
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

//
// EndPoint 3
//
//Retorno
//Se existe estoque disponivel (ou seja estoque maior ou igual a 1)
// Altera o status de 1 item de IN_STOCK para RESERVED
// HTTP 200 + JSON: {"reservationToken": "22489339-5462-458b-b184-fc1f55eedab5"}
//Se não existe estoque disponivel (ou seja estoque menor que 1)
// HTTP 400
//Observaçao: O Token é unico para aquele produto e para aquela reserva
const reserve = async (req, res, next) => {
  //Recebendo o Id do Produto e o Token
  const productId = req.params.id;

  try {
    const product = await Product.findOne({ _id: productId });

    if (product != null && product.stock > 0) {
      product.stock = product.stock - 1;
      product.reserved = product.reserved + 1;

      const updatedProduct = await Product.updateOne(
        { _id: productId },
        product
      );
      const reservationToken = require('crypto').randomUUID();

      //Montando o Objeto Reserve para salvar no Banco
      const reserve = {
        productId,
        reservationToken,
      };

      await Reserve.create(reserve);
      res.status(200).json({ reservationToken: reservationToken });
    }
  } catch (error) {
    res.status(400).json();
  }
};

//
// EndPoint 4
//
//Retorno
//Se o token confere com o produto, move o item de RESERVED para IN_STOCK
// HTTP 200
//Se o token nao confere retorna nada
const unreserve = async (req, res, next) => {
  //Recebendo o Id do Produto e o Token
  const productId = req.params.id;
  const { reservationToken } = req.body;

  try {
    const product = await Product.findOne({ _id: productId });

    const reserve = await Reserve.findOne({
      productId: productId,
      reservationToken: reservationToken,
    });

    if (reserve != null) {
      product.stock = product.stock + 1;
      product.reserved = product.reserved - 1;

      const updatedProduct = await Product.updateOne(
        { _id: productId },
        product
      );

      await Reserve.deleteOne({
        productId: reserve.productId,
        reservationToken: reserve.reservationToken,
      });
    }
    res.status(200).json('');
  } catch (error) {
    res.status(400).json();
  }
};

//
// EndPoint 5
//
//Retorno
//Se o token confere com o produto, move o item de RESERVED para SOLD
// HTTP 200
//Se não for bem sucedido
// HTTP 400
const sold = async (req, res, next) => {
  //Recebendo o Id do Produto e o Token
  const productId = req.params.id;
  const { reservationToken } = req.body;

  try {
    const product = await Product.findOne({ _id: productId });

    const reserve = await Reserve.findOne({
      productId: productId,
      reservationToken: reservationToken,
    });

    if (reserve != null) {
      product.sold = product.sold + 1;
      product.reserved = product.reserved - 1;

      const updatedProduct = await Product.updateOne(
        { _id: productId },
        product
      );

      await Reserve.deleteOne({
        productId: reserve.productId,
        reservationToken: reserve.reservationToken,
      });
    }
    res.status(200).json('');
  } catch (error) {
    res.status(400).json();
  }
};

module.exports = {
  adicionar,
  listar,
  buscar,
  getStock,
  getProduct,
  reserve,
  unreserve,
  sold,
};
