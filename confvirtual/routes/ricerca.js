const express = require('express');
const router = express.Router();

const ricerca = require('../controllers/ricerca');

router.get("/?", ricerca.ricercaUtenti, ricerca.ricercaConferenze, ricerca.renderizzaPagina);

module.exports = router;