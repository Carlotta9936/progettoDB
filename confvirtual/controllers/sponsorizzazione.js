const mysql = require('mysql');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    multipleStatements: true
});

exports.formSponsorizzazione = (req, res)=>{
    db.query('SELECT * FROM sponsor; SELECT acronimo,anno FROM conferenza', function(err,results,fields){
        if(err) throw err;
        else 
        res.render('newsponsorizzazione', {sponsors: results[0], conferenze: results[1]});
    });
}


exports.creaSponsorizzazione = (req,res)=>{
    console.log(req.body);
    const {importo, conferenza, sponsor} = req.body;
    let stringa = conferenza.split("@");
    let acronimo = stringa[0];
    let anno= stringa[1];

    db.query(`INSERT INTO sponsorizzazione(importo, annoConf, acronimoConf, nome_sponsor) VALUES ('${importo}','${anno}','${acronimo}','${sponsor}');`,(err, results)=>{
        if(err){
            console.log(err);
        }else{
            console.log('ok');
        }
    })
}