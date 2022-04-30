var express = require('express');
var router = express.Router();

const autoreController = require ('../controllers/autore');

router.get('/nuovoAutore/:id_articolo', autoreController.formAutore);

router.post('/nuovoAutore/:id_articolo', autoreController.creaAutore);
router.post('/assegnaAutore/:id_articolo', autoreController.assegnaAutore);
router.post('/assegnaAutorePresenter/:id_articolo', autoreController.assegnaAutorePresenter);

module.exports = router;