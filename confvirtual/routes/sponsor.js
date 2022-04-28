var express = require('express');
var router = express.Router();

const {upload} = require("../modules/multer")
///     ROUTES PER LA CREAZIONE DI NUOVI SPONSOR
const sponsorController = require ('../controllers/sponsor');

//form per la creazione di un nuovo sponsor
router.get('/nuovoSponsor/:acronimo/:anno', sponsorController.formSponsor);
router.post('/nuovoSponsor/:acronimo/:anno',  upload.fields([{ name : 'image'}]), sponsorController.creaSponsor);

module.exports = router;