const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../connectionDB');
const { DateTime } = require('luxon');

var token;

exports.informazioniPersonali = (req, res, next) => {
    db.query(`call informazioniPersonali('${req.params.username}')`, (err, result) => {
        if(err) { throw err; }
        result[0][0].data_nascita = DateTime.fromJSDate(result[0][0].data_nascita).toLocaleString(DateTime.DATE_MED);
        res.locals.informazioniPersonali = result[0][0];
        next();
    })
}

exports.conferenze = (req, res, next) => {
    db.query(`call conferenze('${req.params.username}')`, (err, result) => {
        if(err) { throw err; }
        for(var i=0; i<result[0].length; i++){
            result[0][i].datainizio = DateTime.fromJSDate(result[0][i].datainizio).toLocaleString(DateTime.DATE_MED);
            result[0][i].datafine = DateTime.fromJSDate(result[0][i].datafine).toLocaleString(DateTime.DATE_MED);
        }
        res.locals.conferenze = result[0];
        next();
    })
}

exports.presentazioniPreferite = (req, res, next) => {
    db.query(`call presentazioniPreferite('${req.params.username}')`, (err, result) => {
        if(err) { throw err; }
        result[0][0].programma_giornalieroData = DateTime.fromJSDate(result[0][0].programma_giornalieroData).toLocaleString(DateTime.DATE_MED);
        res.locals.presentazioniPreferite = result[0];
        next();
    })
}

exports.renderizzaProfilo = (req, res) => {
    //console.log(res.locals);
    //console.log(res.locals.presentazioniPreferite);
    res.render('profile', {
        username: res.locals.informazioniPersonali.username, 
        nome: res.locals.informazioniPersonali.nome, 
        cognome: res.locals.informazioniPersonali.cognome,
        luogoNascita: res.locals.informazioniPersonali.luogo_nascita,
        dataNascita: res.locals.informazioniPersonali.data_nascita,
        conferenze: res.locals.conferenze,
        presentazioni: res.locals.presentazioniPreferite
    })
}