const express = require('express');
const router = express.Router();

const presentazioneController = require('../controllers/presentazione');

router.get('/nuovaPresentazione', presentazioneController.formPresentazione);

router.post('/nuovaPresentazione', presentazioneController.creaPresentazione);
router.get('/articolo/:id_articolo',presentazioneController.formArticolo);
router.post('/articolo/:id_articolo',presentazioneController.creaArticolo);
router.get('/tutorial/:id_tutorial',presentazioneController.formTutorial);
router.post('/tutorial/:id_tutorial',presentazioneController.creaTutorial);
//router.get('/autori/:id_articolo',presentazioneController.assegnaAutori);



module.exports = router;