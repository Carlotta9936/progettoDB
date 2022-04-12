const express = require('express');
const router = express.Router();

const presentazioneController = require('../controllers/presentazione');

router.get('/nuovaPresentazione/:sessione', presentazioneController.formPresentazione);

router.post('/nuovaPresentazione/:sessione', presentazioneController.creaPresentazione);
router.get('/articolo/:id_articolo',presentazioneController.formArticolo);
router.post('/articolo/:id_articolo',presentazioneController.creaArticolo);
router.get('/tutorial/:id_tutorial',presentazioneController.formTutorial);
router.post('/tutorial/:id_tutorial',presentazioneController.creaTutorial);
router.get('/chiavi/:id_articolo',presentazioneController.formParoleChiave);
router.post('/chiavi/:id_articolo',presentazioneController.creaParoleChiave);




module.exports = router;