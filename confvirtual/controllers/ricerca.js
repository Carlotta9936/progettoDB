const db = require('../connectionDB');

exports.ricercaUtenti = (req, res, next) => {
    db.query(`call ricercaUtenti('${req.query.s}')`, (err, results) => {
        console.log(results[0]);
        res.locals.utenti = results[0];
        next();
    })
}

exports.ricercaConferenze = (req, res, next) => {
    db.query(`call ricercaConferenze('${req.query.s}')`, (err, results) => {
        console.log(results[0]);
        res.locals.conferenze = results[0];
        next();
    })
}

exports.renderizzaPagina = (req, res) => {
    console.log("yo:    " + res.locals.utenti);
    res.render('paginaRicerche', {utenti: res.locals.utenti, conferenze: res.locals.conferenze});
}