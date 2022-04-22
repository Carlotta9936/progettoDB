var express = require('express');
var router = express.Router();

const tutorialController = require ('../controllers/tutorial');

router.get('/:id_tutorial', tutorialController.specificaTutorial);
router.post('/:username/mipiace/:id_tutorial', tutorialController.mipiace);
router.post('/:id_tutorial/vota', tutorialController.vota);

module.exports = router;