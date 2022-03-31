const express = require('express');
const router = express.Router();

const profiloUtente = require ('../controllers/profiloUtente');

/*
router.get('/profilo/:username', (req, res) => {
    res.render('profile', {user: req.params.username, ruolo: "stronzo"});
}
 );*/

 router.get('/profilo', (req, res) => {
    res.render('profile', {user: "req.params.username", ruolo: "stronzo"});
}
 );

// 
module.exports = router;