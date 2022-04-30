const express = require('express');
const router = express.Router();

const {upload} = require("../modules/multer")

const presentazioneController = require('../controllers/presentazione');

router.get('/nuovaPresentazione/:sessione', presentazioneController.formPresentazione);

router.post('/nuovaPresentazione/:sessione', presentazioneController.creaPresentazione);
router.get('/articolo/:id_articolo',presentazioneController.formArticolo);
router.post('/articolo/:id_articolo', upload.fields([{name : 'PDF'}]), presentazioneController.creaArticolo);
router.get('/articolo/:id_articolo/Assegnaautori',presentazioneController.assegnaAutori);
router.get('/tutorial/:id_tutorial',presentazioneController.formTutorial);
router.post('/tutorial/:id_tutorial', presentazioneController.creaTutorial);
router.get('/chiavi/:id_articolo',presentazioneController.formParoleChiave);
router.post('/chiavi/:id_articolo',presentazioneController.creaParoleChiave);
router.post('/speaker/:id_tutorial',presentazioneController.associaSpeaker);

module.exports = router;