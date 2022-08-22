const router = require('express').Router();
const controller = require('../controllers/productController');

router.get('/:id/stock', controller.getStock);
router.get('/:id', controller.getProduct);
router.post('/:id/reserve', controller.reserve);
router.post('/:id/unreserve', controller.unreserve);
router.post('/:id/sold', controller.sold);

//Teste CRUD
router.get('/teste/adicionar', controller.adicionar);
router.get('/teste/listar', controller.listar);
router.get('/teste/buscar/:id', controller.buscar);

module.exports = router;
