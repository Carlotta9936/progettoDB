const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../connectionDB');


exports.formAutore = (req,res)=>{
    res.render('newautore');
}

exports.creaAutore = (req,res)=>{
    console.log(req.body);
    const{nome, cognome}= req.body;

    db.query(`INSERT INTO autore(nome, cognome) VALUES ('${nome}', '${cognome}');`,(err, results)=>{
        if(err){
            console.log(err);
        }else{
            console.log('ok');
        }
    })
}