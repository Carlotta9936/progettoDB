const express = require('express');
const router = express.Router();

/// ROUTES PER LE CONFERENZE    ///*

const conferenzaController = require('../controllers/conferenza');

router.get('/nuovaConferenza1-2', conferenzaController.formConferenza);
router.post('/nuovaConferenza1-2', conferenzaController.creaConferenza, conferenzaController.creaProgramma);
router.get('/nuovaConferenza2-2/:acronimo/:anno', conferenzaController.formSessione);
router.post('/nuovaConferenza2-2/:acronimo/:anno/:programma', conferenzaController.creaSessione);


module.exports = router;