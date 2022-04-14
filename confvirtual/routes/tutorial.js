var express = require('express');
var router = express.Router();

const tutorialController = require ('../controllers/tutorial');

router.get('/:id_tutorial', tutorialController.specificaTutorial);

module.exports = router;