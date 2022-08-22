//Configuracao Inicial
const express = require('express');
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const app = express();
const router = express.Router();

//Forma de ler JSON / Middlewares
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

//Importar Rotas
const productRoutes = require('./routes/productRoutes');
app.use('/product', productRoutes);

//Entregar uma Porta
mongoose
  .connect(
    'mongodb+srv://administrador:teste123Mongo@cluster0.mjhxj5s.mongodb.net/kuantokusta?retryWrites=true&w=majority'
  )
  .then(() => {
    console.log('Conectado Banco Mongo DB Atlas');
    app.listen(8080);
  })
  .catch(err => console.log(err));
