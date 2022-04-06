var express = require('express');
var router = express.Router();

const autoreController = require ('../controllers/autore');

router.get('/nuovoAutore', autoreController.formAutore);

router.post('/nuovoAutore/:id_articolo', autoreController.creaAutore);
router.post('/assegnaAutore/:id_articolo',autoreController.assegnaAutore);

module.exports = router;