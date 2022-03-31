var express = require('express');
var router = express.Router();

const profiloUtente = require ('../controllers/profiloUtente');

router.get('/profilo:username', profiloUtente.informazioniPersonali, profiloUtente.conferenze, profiloUtente.presentazioniPreferite);

module.exports = router;