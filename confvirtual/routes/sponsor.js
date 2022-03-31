var express = require('express');
var router = express.Router();

const sponsorController = require ('../controllers/sponsor');

router.get('/nuovoSponsor', sponsorController.formSponsor);

router.post('/nuovoSponsor', sponsorController.creaSponsor);

module.exports = router;