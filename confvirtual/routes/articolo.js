var express = require('express');
var router = express.Router();

const articoloController = require ('../controllers/articolo');

router.get('/:id_articolo', articoloController.specificaArticolo);
router.post('/:username/mipiace/:id_articolo', articoloController.mipiace);
router.get('/:id_articolo/presenter',articoloController.formaddPresenter);
router.post('/:id_articolo/presenter',articoloController.addPresenter);


module.exports = router;