const express = require('express');
const router = express.Router();

const sponsorizzazioneController = require('../controllers/sponsorizzazione');

router.get('/nuovaSponsorizzazione', sponsorizzazioneController.formSponsorizzazione);

router.post('/nuovaSponsorizzazione',sponsorizzazioneController.creaSponsorizzazione);

module.exports = router;