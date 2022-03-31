const mysql = require('mysql');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.formConferenza = (req, res)=>{
    res.render('newconferenza');
}

exports.creaConferenza = (req,res)=>{
    console.log(req.body);
    const {acronimo, anno, logo, dataInizio, dataFine, nome, creatore} = req.body;

    db.query(`INSERT INTO conferenza(acronimo, anno, logo, datainizio, datafine, totale_sponsorizzazioni, svolgimento, nome, creatore) VALUES ('${acronimo}','${anno}', '${logo}', '${dataInizio}', '${dataFine}', 1, 'attiva', '${nome}', '${creatore}');`,(err, results)=>{
        if(err){
            console.log(err);
        }else{
            console.log('ok');
        }
    })
}