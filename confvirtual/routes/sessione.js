const express = require('express');
const router = express.Router();

const sessioneController = require('../controllers/sessione');

router.get('/nuovaSessione', sessioneController.formSessione);
router.post('/nuovaSessione',sessioneController.creaSessione);

router.get('/:id_sessione/:titolo', sessioneController.specificaSessione);



module.exports = router;