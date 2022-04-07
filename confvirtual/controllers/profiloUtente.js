const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../connectionDB');

var token;

exports.informazioniPersonali = (req, res, next) => {
    db.query(`call informazioniPersonali('${req.params.username}')`, (err, result) => {
        if(err) { throw err; }
        res.locals.informazioniPersonali = result[0][0];
        next();
    })
}

exports.conferenze = (req, res, next) => {
    db.query(`call conferenze('${req.params.username}')`, (err, result) => {
        if(err) { throw err; }
        res.locals.conferenze = result[0];
        next();
    })
}

exports.presentazioniPreferite = (req, res, next) => {
    db.query(`call presentazioniPreferite('${req.params.username}')`, (err, result) => {
        if(err) { throw err; }
        res.locals.presentazioniPreferite = result[0];
        next();
    })
}

exports.renderizzaProfilo = (req, res) => {
    //console.log(res.locals);
    console.log(res.locals.presentazioniPreferite);
    res.render('profile', {
        username: res.locals.informazioniPersonali.username, 
        nome: res.locals.informazioniPersonali.nome, 
        cognome: res.locals.informazioniPersonali.cognome,
        luogoNascita: res.locals.informazioniPersonali.luogo_nascita,
        dataNascita: res.locals.informazioniPersonali.data_nascita,
        conferenze: res.locals.conferenze,
        presentazioni: res.locals.presentazioniPreferite
        /*nomeConferenza: res.locals.conferenze.nome,
        acronimoConferenza: res.locals.conferenze.acronimo,
        annoConferenza: res.locals.conferenze.anno,
        dataInizio: res.locals.conferenze.datainizio,
        dataFine: res.locals.conferenze.datafine,
        presentazioniNome: res.locals.presentazioniPreferite.conferenzaNome,
        presentazioniData: res.locals.presentazioniPreferite.programma_giornalieroData*/
    
    })
}