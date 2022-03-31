const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../connectionDB');


var token;

exports.informazioniPersonali = (req, res, next) => {
    db.query(`SELECT username, nome, cognome, luogo_nascita, data_nascita FROM utente WHERE username = '${req.params.username}'`, (err, result) => {
        if(err) { throw err; }
        console.log(result);
    })
    next();
}

exports.conferenze = (req, res, next) => {
    next();
}

exports.presentazioniPreferite = (req, res, next) => {

}