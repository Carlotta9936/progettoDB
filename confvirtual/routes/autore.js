var express = require('express');
var router = express.Router();

const autoreController = require ('../controllers/autore');

router.get('/nuovoAutore', autoreController.formAutore);

router.post('/nuovoAutore', autoreController.creaAutore);

module.exports = router;