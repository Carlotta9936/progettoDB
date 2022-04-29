const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../connectionDB');
const { DateTime } = require('luxon');
const {updateLog} = require('../modules/connectionDBMongo');
var path = require("path");


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

exports.informazioniPersonali2 = (req, res, next) => {
    db.query(``)
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
    updateLog(`${decoded.log}`, {profiliGuardati: `${res.locals.informazioniPersonali.username}`});
    var mod, agg1, agg2 = false;
    var foto = null;
    console.log(res.locals);

    if(res.locals.informazioniPersonali.username===decoded.username){
        console.log("Sono io")
        agg1=true;
        if(decoded.diritti==="Utente"){
            mod=true;
        }
        if (decoded.diritti==="Presenter" || decoded.diritti==="Speaker") {
            agg2=true;
        }
    }

    console.log(decoded.diritti==="Presenter" || decoded.diritti==="Speaker");

    if(res.locals.file != undefined){
        foto = res.locals.file.image;
        curriculum = res.locals.file.cv;
    }

    res.render('profile', {
        modifica: mod,
        aggiorna1: agg1,
        aggiorna2: agg2,
        username: res.locals.informazioniPersonali.username, 
        fotoProfilo: foto,
        cv: curriculum,
        nome: res.locals.informazioniPersonali.nome, 
        cognome: res.locals.informazioniPersonali.cognome,
        luogoNascita: res.locals.informazioniPersonali.luogo_nascita,
        dataNascita: res.locals.informazioniPersonali.data_nascita,
        conferenze: res.locals.conferenze,
        presentazioni: res.locals.presentazioniPreferite
    })
}


exports.modifica = (req, res) => {

    console.log(res.locals.informazioniPersonali.data_nascita);
    //res.locals.informazioniPersonali.data_nascita = new Date(res.locals.informazioniPersonali.data_nascita).toISOString().split("T")[0];
    console.log(res.locals.informazioniPersonali.data_nascita);
    res.render('modificaProfilo', {Dati: res.locals.informazioniPersonali, msg: ""});

}


exports.aggiornaInfo = (req, res) => {
    const { username, password, passwordConfirm, nome, cognome, luogoNascita, dataNascita } = req.body;
    db.query(`call aggiornaInfo('${username}', '${password}', '${nome}', '${cognome}', '${luogoNascita}', '${dataNascita}');`, (err, results) => {
        if(err){
            if (err.code === 'ER_TRUNCATED_WRONG_VALUE'){   
                console.log("we");
                res.render('modificaProfilo', {Dati: "", msg: "non tutti i dati inseriti sono validi"});
            }else{ throw err; }
            
        }else{
        res.redirect('/homepage');
        }
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
    var foto = req.files.image
    var cv = req.files.cv
    console.log(cv);
    //console.log("--------" + foto[0]);
    db.query(`call getInfoPS('${req.params.username}')`, (err, result) => {
        if(err) {throw err; }
        if(foto === undefined){
            foto = result[0][0].foto;
        } else {
            foto = foto[0].filename;
        }
        if(cv === undefined) {
            cv = result[0][0].cv;
        } else {
            cv = cv[0].filename
        }

        console.log(foto);
        db.query(`call aggiornaInfoPs('${result[0][0].ruolo}', '${result[0][0].username}','${uni}', '${dipartimento}', '${cv}', '${foto}')`, (err, result) => {
            if(err) {throw err;}
            res.redirect('/homepage');
        })
    })
    
}

exports.scaricaCurriculum = (req, res) => {
    db.query(`call getCV('${req.params.username}')`, (err, result) => {
        console.log(result[0][0].cv);
        //console.log();
        res.download(`confvirtual/public/uploads/${result[0][0].cv}`, result[0][0].cv);
    })
    
}