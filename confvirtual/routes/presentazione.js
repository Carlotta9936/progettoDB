const express = require('express');
const router = express.Router();

const presentazioneController = require('../controllers/presentazione');

router.get('/nuovaPresentazione', presentazioneController.formPresentazione);

router.post('/nuovaPresentazione', presentazioneController.creaPresentazione);
router.get('/articolo/:id_articolo',presentazioneController.creaArticolo);
router.get('/tutorial/:id_tutorial',presentazioneController.creaTutorial);


module.exports = router;