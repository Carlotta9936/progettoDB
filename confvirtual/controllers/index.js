const mysql = require('mysql');
const db = require('../connectionDB');

exports.informazioni = (req,res)=>{
    
    db.query(`SELECT count(*) as numUtenti FROM utente; SELECT count(*) as numConferenze FROM conferenza;`,(err, results)=>{
        if(err) { throw err; }
        res.render('index', {numUtenti: results[0][0].numUtenti, numConferenze: results[1][0].numConferenze});
    })
}