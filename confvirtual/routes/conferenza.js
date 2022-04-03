const express = require('express');
const router = express.Router();

/// ROUTES PER LE CONFERENZE    ///*

const conferenzaController = require('../controllers/conferenza');

router.get('/nuovaConferenza1-2', conferenzaController.formConferenza);

router.post('/nuovaConferenza1-2', conferenzaController.creaConferenza, conferenzaController.creaProgramma);

module.exports = router;