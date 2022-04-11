const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

////    ROUTES PER INDEX, LOGIN, SIGNIN, HOMEPAGE    ///

// Require controller modules
const index = require ('../controllers/index');
const utenti = require('../controllers/utenti');
const homepage = require('../controllers/homepage');
const conferenza = require ('../controllers/conferenza');
const sessione= require('../controllers/sessione');
const presentazione= require('../controllers/presentazione');
const autore= require('../controllers/autore');



//INDEX
router.get('/', index.informazioni);


//LOGIN
router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', utenti.login, utenti.profile);


//SIGN IN
router.get('/signin', (req, res) =>{            
  res.render('signin')
})

router.post('/signin', utenti.signin, utenti.profile);          //Registra un nuovo utente

//HOMEPAGE
router.get('/homepage', homepage.preferiti, homepage.classificaPresentazioni, homepage.classificaEventiHype, homepage.classificaPresentatori, homepage.renderizzaHomepage);

router.get('/conferenza/:acronimo/:anno', conferenza.programma);
router.get('/conferenza', conferenza.disponibile);

router.post('/conferenza/:acronimo/:anno', conferenza.segui);

router.get('/sessione/:id_sessione/:titolo', sessione.specificaSessione);


//  UPGRADES
router.post('/nuovoAdmin', utenti.controlloDiritti, utenti.update_administrator);

router.get('/nuovoPresenter', utenti.controlloDiritti, utenti.form_presenter);
router.post('/nuovoPresenter', utenti.update_presenter);
router.get('/nuovoSpeaker', utenti.controlloDiritti, utenti.form_speaker);
router.post('/nuovoSpeaker', utenti.update_speaker)


router.get('/profilo', (req, res) => {
  var decoded = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET)
  res.redirect(`/utenti/${decoded.username}`);
}

)
module.exports = router;
