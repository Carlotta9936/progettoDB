const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../connectionDB');

var token;

exports.informazioniPersonali = (req, res, next) => {
    db.query(`SELECT username, nome, cognome, luogo_nascita, data_nascita FROM utente WHERE username = 'Alsi'`, (err, result) => {
        if(err) { throw err; }
        console.log(result[0].nome);
        res.render('profile-informazioniPersonali', {username: result[0].username, nome: result[0].nome, cognome: result[0].cognome, luogoNascita: result[0].luogo_nascita, dataNascita: result[0].data_nascita});
    })    
}

exports.conferenze = (req, res, next) => {
    next();
}

exports.presentazioniPreferite = (req, res, next) => {

}