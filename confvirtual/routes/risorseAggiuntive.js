const express = require('express');
const router = express.Router();

const risorseAggiuntiveController = require ('../controllers/risorseAggiuntive');

router.get('/:id_tutorial', risorseAggiuntiveController.formRisorse);
router.post('/:id_tutorial', risorseAggiuntiveController.creaRisorsa);

module.exports = router;