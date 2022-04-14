var express = require('express');
var router = express.Router();

const articoloController = require ('../controllers/articolo');

router.get('/:id_articolo', articoloController.specificaArticolo);

module.exports = router;