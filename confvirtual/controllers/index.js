const mysql = require('mysql');
const db = require('../connectionDB');

exports.informazioni = (req,res)=>{
    
    db.query(`call informazioniIniziali();`,(err, results)=>{
        if(err) { throw err; }
        res.render('index', {numUtenti: results[0][0].numUtenti, numConferenze: results[1][0].numConferenze});
    })
}