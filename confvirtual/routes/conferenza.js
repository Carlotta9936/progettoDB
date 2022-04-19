const express = require('express');
const router = express.Router();

const {upload} = require("../modules/multer")
/// ROUTES PER LE CONFERENZE    ///*

const conferenzaController = require('../controllers/conferenza');

router.get('/nuovaConferenza1-3', conferenzaController.formConferenza);
router.post('/nuovaConferenza1-3', upload.fields([{ name : 'logo'}]), conferenzaController.creaConferenza, conferenzaController.creaProgramma);
router.get('/nuovaConferenza2-3/:acronimo/:anno', conferenzaController.formSessione);
router.post('/nuovaConferenza2-3/:acronimo/:anno/:programma', conferenzaController.creaSessione);
router.get('/nuovaConferenza3-3/:acronimo/:anno',conferenzaController.formSponsorizzazione);
router.post('/nuovaConferenza3-3/:acronimo/:anno', conferenzaController.creaSponsorizzazione);
router.get('/ricerca/:acronimo/:anno',conferenzaController.ricercaConferenza);




module.exports = router;