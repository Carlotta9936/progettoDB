const express = require('express');
const router = express.Router();

const presentazioneController = require('../controllers/presentazione');

router.get('/nuovaPresentazione', presentazioneController.formPresentazione);

router.post('/nuovaPresentazione', presentazioneController.creaPresentazione);

module.exports = router;