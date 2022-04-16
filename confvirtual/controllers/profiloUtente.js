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
        if(result[0].length === 0){ res.status(404).render("notFound"); }
        else {
            result[0][0].data_nascita = DateTime.fromJSDate(result[0][0].data_nascita).toLocaleString(DateTime.DATE_MED);
            res.locals.informazioniPersonali = result[0][0];
            next();
        }
    })
}

exports.caricaFile = (req, res, next) => {
    db.query(`call getFilePersonali('${req.params.username}')`, (err, results) => {
        if(err) {throw err; }
        console.log("--->" + results[0][0]);
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
    console.log(decoded.username);
    console.log(res.locals.informazioniPersonali.username)

    if(res.locals.informazioniPersonali.username===decoded.username){
        console.log("Sono io")
        if (decoded.diritti==="Presenter" || decoded.diritti==="Speaker") {
            res.render('profile', {
                modifica:false,
                username: res.locals.informazioniPersonali.username, 
                fotoProfilo: res.locals.file.image,
                nome: res.locals.informazioniPersonali.nome, 
                cognome: res.locals.informazioniPersonali.cognome,
                luogoNascita: res.locals.informazioniPersonali.luogo_nascita,
                dataNascita: res.locals.informazioniPersonali.data_nascita,
                conferenze: res.locals.conferenze,
                presentazioni: res.locals.presentazioniPreferite
        })} else {
            res.render('profile', {
                modifica: true,
                username: res.locals.informazioniPersonali.username,
                nome: res.locals.informazioniPersonali.nome, 
                cognome: res.locals.informazioniPersonali.cognome,
                luogoNascita: res.locals.informazioniPersonali.luogo_nascita,
                dataNascita: res.locals.informazioniPersonali.data_nascita,
                conferenze: res.locals.conferenze,
                presentazioni: res.locals.presentazioniPreferite
            })
        }} else {
            console.log("Non sono io")
            console.log("no piu:   " + res.locals.file);
            if(res.locals.file === undefined){
                res.render('profile', {
                    modifica: false,
                    username: res.locals.informazioniPersonali.username,
                    fotoProfilo: null,
                    nome: res.locals.informazioniPersonali.nome, 
                    cognome: res.locals.informazioniPersonali.cognome,
                    luogoNascita: res.locals.informazioniPersonali.luogo_nascita,
                    dataNascita: res.locals.informazioniPersonali.data_nascita,
                    conferenze: res.locals.conferenze,
                    presentazioni: res.locals.presentazioniPreferite
                })
            } else {
                res.render('profile', {
                    modifica:false,
                    username: res.locals.informazioniPersonali.username, 
                    fotoProfilo: res.locals.file.image,
                    nome: res.locals.informazioniPersonali.nome, 
                    cognome: res.locals.informazioniPersonali.cognome,
                    luogoNascita: res.locals.informazioniPersonali.luogo_nascita,
                    dataNascita: res.locals.informazioniPersonali.data_nascita,
                    conferenze: res.locals.conferenze,
                    presentazioni: res.locals.presentazioniPreferite
    })
    }}
}


exports.modifica = (req, res) => {
    console.log(res.locals.informazioniPersonali.data_nascita);
    res.locals.informazioniPersonali.data_nascita = new Date(res.locals.informazioniPersonali.data_nascita).toISOString().split("T")[0];
    console.log(res.locals.informazioniPersonali.data_nascita);
    res.render('modificaProfilo', {Dati: res.locals.informazioniPersonali});

}


exports.aggiornaInfo = (req, res) => {
    const { username, password, passwordConfirm, nome, cognome, luogoNascita, dataNascita } = req.body;
    db.query(`call aggiornaInfo('${username}', '${password}', '${nome}', '${cognome}', '${luogoNascita}', '${dataNascita}');`, (err, results) => {
        if(err) {throw err;}
        res.redirect('/homepage');
    });
}

exports.getInfo = (req, res, next) => {
    db.query(`call getInfoPS('${req.params.username}')`, (err, result) => {
        console.log(result[0][0]);
        res.locals.foto=  result[0][0];
        res.render('modificaInfoPS', {Dati: result[0][0]});
    })
}

exports.aggiornaPS = (req, res) => {
    const {uni, dipartimento} = req.body;
    var foto = req.files.image;
    var cv = req.files.cv;
    console.log(cv);
    //console.log("--------" + foto[0]);
    db.query(`call getInfoPS('${req.params.username}')`, (err, result) => {
        if(err) {throw err; }
        if(foto === undefined){
            foto = result[0][0].foto;
        }
        if(cv === undefined) {
            cv = result[0][0].cv;
        }

        console.log();
        db.query(`call aggiornaInfoPs('${result[0][0].ruolo}', '${result[0][0].username}','${uni}', '${dipartimento}', '${cv[0].filename}', '${foto[0].filename}')`, (err, result) => {
            if(err) {throw err;}
            res.redirect('/homepage');
        })
    })
    
}