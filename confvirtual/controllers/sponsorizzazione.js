const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../connectionDB');


exports.formSponsorizzazione = (req, res)=>{
    //fatto
    //db.query('SELECT * FROM sponsor; SELECT acronimo,anno FROM conferenza', function(err,results,fields){
     db.query('call sponsorconferenza ()',(err,results)=>{  
        if(err) throw err;
        else 
            res.render('newsponsorizzazione', {sponsors: results[0][0], conferenze: results[0][1]});
    });
}


exports.creaSponsorizzazione = (req,res)=>{
    console.log(req.body);
    const {importo, conferenza, sponsor} = req.body;
    let stringa = conferenza.split("@");
    let acronimo = stringa[0];
    let anno= stringa[1];

    //db.query(`INSERT INTO sponsorizzazione(importo, annoConf, acronimoConf, nome_sponsor) VALUES ('${importo}','${anno}','${acronimo}','${sponsor}');`,(err, results)=>{
    db.query(`call insertsponsorizzazione ('${importo}','${anno}','${acronimo}','${sponsor}')`,(err,results)=>{
        if(err){
            console.log(err);
        }else{
            console.log('ok');
        }
    })
}