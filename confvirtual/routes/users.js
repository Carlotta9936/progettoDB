var express = require('express');
var router = express.Router();

///   ROUTES PER PAGINE CON TUTTI GLI UTENTI, PROFILI E UPGRADES
const utenti = require('../controllers/utenti');
const profilo = require('../controllers/profiloUtente');

/// USERS ROUTERS 
router.get('/', utenti.users_page);  //Vedere la pagina con tutti gli utenti

router.get('/:username', profilo.informazioniPersonali, profilo.conferenze, profilo.presentazioniPreferite, profilo.renderizzaProfilo);    //Vedere il profilo di un utente

/// UPGRADES ///
router.post('/nuovoAdmin', utenti.update_administrator);


module.exports = router;
