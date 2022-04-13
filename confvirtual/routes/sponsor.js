var express = require('express');
var router = express.Router();

///     ROUTES PER LA CREAZIONE DI NUOVI SPONSOR
const sponsorController = require ('../controllers/sponsor');

//form per la creazione di un nuovo sponsor
router.get('/nuovoSponsor/:acronimo/:anno', sponsorController.formSponsor);
router.get('/:nome', sponsorController.paginaSponsor);

router.post('/nuovoSponsor/', sponsorController.creaSponsor);

module.exports = router;