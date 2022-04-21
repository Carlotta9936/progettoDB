var express = require('express');
var router = express.Router();

const {upload} = require("../modules/multer")

///   ROUTES PER PAGINE CON TUTTI GLI UTENTI, PROFILI E UPGRADES
const utenti = require('../controllers/utenti');
const profilo = require('../controllers/profiloUtente');

/// USERS ROUTERS 
router.get('/', utenti.users_page);  //Vedere la pagina con tutti gli utenti

router.get('/:username', profilo.informazioniPersonali, profilo.caricaFile, profilo.conferenze, profilo.presentazioniPreferite, profilo.renderizzaProfilo);    //Vedere il profilo di un utente

router.get('/:username/modificaProfilo', profilo.informazioniPersonali, profilo.modifica)
router.post('/:username/modificaProfilo', profilo.aggiornaInfo);

router.get('/:username/modificaInfoPS', profilo.getInfo);
router.post('/:username/modificaInfoPS', upload.fields([{ name : 'image'}, {name : 'cv'}]), profilo.aggiornaPS)

router.get('/:username/curriculum', profilo.scaricaCurriculum);
/// UPGRADES ///



//



module.exports = router;
