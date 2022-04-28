const express = require('express');
const router = express.Router();
const {upload} = require("../modules/multer")

const tutorialController = require ('../controllers/tutorial');

router.get('/:id_tutorial', tutorialController.specificaTutorial);
router.post('/:username/mipiace/:id_tutorial', tutorialController.mipiace);
router.post('/:id_tutorial/vota', tutorialController.vota);
router.post('/:id_tutorial/addRisorsaAggiuntiva', upload.fields([{ name : 'risAgg'}]), tutorialController.risorsaAggiuntiva);
router.get('/:id_tutorial/modificaRisorsa/:idRisorsa', tutorialController.modificaRisorsaAggiuntiva);
router.post('/:id_tutorial/modificaRisorsa/:idRisorsa', upload.fields([{ name : 'risAgg'}]), tutorialController.uploadRisorsaAggiuntiva);

module.exports = router;