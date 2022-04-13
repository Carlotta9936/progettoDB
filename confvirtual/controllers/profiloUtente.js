const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../connectionDB');
const { DateTime } = require('luxon');

var token;

//Raccoglie le informazioni personali dell'utente che si sta cercando
exports.informazioniPersonali = (req, res, next) => {
    db.query(`call informazioniPersonali('${req.params.username}')`, (err, result) => {
        if(err) { throw err; }
        result[0][0].data_nascita = DateTime.fromJSDate(result[0][0].data_nascita).toLocaleString(DateTime.DATE_MED);
        res.locals.informazioniPersonali = result[0][0];
        next();
    })
}

exports.caricaFile = (req, res, next) => {
    db.query(`call getFilePersonali('${req.params.username}')`, (err, results) => {
        if(err) {throw err; }
        console.log(results[0][0]);
        res.locals.file = results[0][0];
        next();
    })
}

//Raccoglie le conferenze a cui l'utente è iscritto
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

//Raccoglie le sue presentazioni preferite
exports.presentazioniPreferite = (req, res, next) => {
    db.query(`call presentazioniPreferite('${req.params.username}')`, (err, result) => {
        if(err) { throw err; }
        for(var i=0; i<result[0].length; i++){
            result[0][i].programma_giornalieroData = DateTime.fromJSDate(result[0][i].programma_giornalieroData).toLocaleString(DateTime.DATE_MED);
        }
        res.locals.presentazioniPreferite = result[0];
        next();
    })
}

//Renderizza il profilo con tutte le informazioni raccolte
exports.renderizzaProfilo = (req, res) => {
    var decoded = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
    console.log(res.locals.file.image);
    if(res.locals.informazioniPersonali.username===decoded.username && decoded.diritti==="Utente"){
        res.render('profile', {
            modifica: true,
            username: res.locals.informazioniPersonali.username,
            fotoProfilo: res.locals.file.image,
            nome: res.locals.informazioniPersonali.nome, 
            cognome: res.locals.informazioniPersonali.cognome,
            luogoNascita: res.locals.informazioniPersonali.luogo_nascita,
            dataNascita: res.locals.informazioniPersonali.data_nascita,
            conferenze: res.locals.conferenze,
            presentazioni: res.locals.presentazioniPreferite
        })

    } else {
        res.render('profile', {
            username: res.locals.informazioniPersonali.username, 
            fotoProfilo: res.locals.file.image,
            nome: res.locals.informazioniPersonali.nome, 
            cognome: res.locals.informazioniPersonali.cognome,
            luogoNascita: res.locals.informazioniPersonali.luogo_nascita,
            dataNascita: res.locals.informazioniPersonali.data_nascita,
            conferenze: res.locals.conferenze,
            presentazioni: res.locals.presentazioniPreferite
        })
    }
    
}