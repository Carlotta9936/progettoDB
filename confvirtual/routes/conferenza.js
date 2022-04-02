const express = require('express');
const router = express.Router();

/// ROUTES PER LE CONFERENZE    ///*

const conferenzaController = require('../controllers/conferenza');

router.get('/nuovaConferenza', conferenzaController.formConferenza);

router.post('/nuovaConferenza', conferenzaController.creaConferenza);

module.exports = router;