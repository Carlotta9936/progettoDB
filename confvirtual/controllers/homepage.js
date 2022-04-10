const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const db = require('../connectionDB');
const { DateTime } = require('luxon');

exports.preferiti = (req,res, next)=>{
    var decoded = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
    db.query(`call conferenzePreferite('${decoded.username}');`, (err, results) => {
        if(err) { throw err; }
        for(let i=0; i<results[0].length; i++){
            results[0][i].datainizio = DateTime.fromJSDate(results[0][i].datainizio).toLocaleString(DateTime.DATE_MED);
            results[0][i].datafine = DateTime.fromJSDate(results[0][i].datafine).toLocaleString(DateTime.DATE_MED);
        }
        res.locals.conferenzePreferite = results[0];
        next();
        //res.render('homepage', {conferenze: results })
    })
}

exports.classificaPresentazioni = (req, res, next) => {
    db.query(`call classificaPresentazioni();`, (err, results) => {
        if(err) {throw err; }
        res.locals.presentazioni = results[0];
        next();
    })
}

exports.classificaEventiHype = (req, res, next) => {
    db.query(`call eventiHype();`, (err, results) => {
        if(err) {throw err; }
        res.locals.hype = results[0];
        next();
    })
}

exports.classificaPresentatori = (req, res, next) => {
    db.query(`call classificaPresentatori`, (err, results) => {
        if(err) {throw err; }
        res.locals.miglioriPS = results[0];
        next();
    })
}

exports.renderizzaHomepage = (req, res) => {
    console.log(res.locals.miglioriPS)
    res.render('homepage', { conferenze: res.locals.conferenzePreferite, classificaPresentazioni: res.locals.presentazioni, classificaEventi: res.locals.hype, miglioriPresenterESpeaker: res.locals.miglioriPS } );
}