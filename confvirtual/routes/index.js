const express = require('express');
const router = express.Router();

// Require controller modules
const index = require ('../controllers/index');
const utenti = require('../controllers/utenti');
const profilo = require('../controllers/profiloUtente');
const conferenza = require ('../controllers/conferenza');


/* GET home page. */
router.get('/', index.informazioni);

//SIGN IN
router.get('/signin', (req, res) =>{            
  res.render('signin')
})

router.post('/signin', utenti.signin);          //Registra un nuovo utente

//LOGIN
router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', utenti.login, utenti.profile);

/// USERS ROUTERS /// 
router.get('/utenti/', utenti.users_page);      //Vedere tutti la pagina con tutti gli utenti
router.get('/utenti/:id', utenti.user_page);    //Vedere la pagina di un utente

/// UPGRADE ///
router.post('/nuovoAdmin', utenti.update_administrator);

router.get('/profilo/:username', profilo.informazioniPersonali, profilo.conferenze, profilo.presentazioniPreferite, profilo.renderizzaProfilo);

router.get('/conferenza/:acronimo/:anno', conferenza.programma);
router.get('/conferenza', conferenza.disponibile);

router.post('/conferenza/:acronimo/:anno', conferenza.segui);

module.exports = router;
