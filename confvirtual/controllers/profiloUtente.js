const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../connectionDB');

var token;

exports.informazioniPersonali = (req, res, next) => {
    db.query(`SELECT username, nome, cognome, luogo_nascita, data_nascita FROM utente WHERE username = '${req.params.username}'`, (err, result) => {
        if(err) { throw err; }
        res.locals.informazioniPersonali = result[0];
        next();
    })
}

exports.conferenze = (req, res, next) => {
    console.log("ba")
    db.query(`SELECT nome, acronimo, anno, datainizio, datafine
            FROM conferenza JOIN iscrizione on (conferenza.anno = iscrizione.iscrizione_anno AND conferenza.acronimo = iscrizione.iscrizione_acronimo)
            WHERE iscrizione_username ='${req.params.username}'`, (err, result) => {
        if(err) { throw err; }
        res.locals.conferenze = result[0];
        next();
    })
}

exports.presentazioniPreferite = (req, res, next) => {
    db.query(`select conferenza.nome as conferenzaNome, programma_giornaliero.data as programma_giornalieroData
                from conferenza inner join programma_giornaliero on (conferenza.anno=programma_giornaliero.anno and conferenza.acronimo=programma_giornaliero.acronimo)
                inner join sessione on( programma_giornaliero.id_programma=sessione.programma)
                inner join presentazione on(sessione.id_sessione= presentazione.sessione)
                inner join preferiti on (presentazione.id_presentazione = preferiti.preferiti_presentazione)
                where preferiti.preferiti_username = '${req.params.username}'`, (err, result) => {
        if(err) { throw err; }
        res.locals.presentazioniPreferite = result[0];
        next();
    })
}

exports.renderizzaProfilo = (req, res) => {
    console.log(res.locals);
    res.render('profile', {
        username: res.locals.informazioniPersonali.username, 
        nome: res.locals.informazioniPersonali.nome, 
        cognome: res.locals.informazioniPersonali.cognome,
        luogoNascita: res.locals.informazioniPersonali.luogo_nascita,
        dataNascita: res.locals.informazioniPersonali.data_nascita,
        nomeConferenza: res.locals.conferenze.nome,
        acronimoConferenza: res.locals.conferenze.acronimo,
        annoConferenza: res.locals.conferenze.anno,
        dataInizio: res.locals.conferenze.datainizio,
        dataFine: res.locals.conferenze.datafine,
        presentazioniNome: res.locals.presentazioniPreferite.conferenzaNome,
        presentazioniData: res.locals.presentazioniPreferite.programma_giornalieroData
    
    })
}