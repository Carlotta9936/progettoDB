const express = require('express');
const router = express.Router();

// Require controller modules
const utenti = require('../controllers/utenti');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//SIGN IN
router.get('/signin', (req, res) =>{
  res.render('signin')
})

router.post('/signin', utenti.signin);          //Registra un nuovo utente

/// USERS ROUTERS /// 
router.get('/utenti/', utenti.users_page);      //Vedere tutti la pagina con tutti gli utenti
router.get('/utenti/:id', utenti.user_page);    //Vedere la pagina di un utente


module.exports = router;
