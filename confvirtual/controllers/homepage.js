const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const db = require('../connectionDB');

exports.preferiti = (req,res)=>{
    var decoded = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
    db.query(`SELECT conferenza.nome as nome, conferenza.acronimo as acronimo, conferenza.anno as anno, conferenza.dataInizio as datainizio, conferenza.dataFine as datafine
                FROM conferenza inner join iscrizione on (conferenza.anno = iscrizione.iscrizione_anno and conferenza.acronimo = iscrizione.iscrizione_acronimo)
                WHERE iscrizione_username = "${decoded.username}"`, (err, results) => {
                    if(err) { throw err; }
                    console.log(decoded.username);
                    res.render('homepage', {conferenze: results })
                })
}