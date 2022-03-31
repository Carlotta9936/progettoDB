const mysql = require('mysql');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.formSponsor = (req,res)=>{
    res.render('newsponsor');
}

exports.creaSponsor = (req,res)=>{
    console.log(req.body);
    const{nome, logo}= req.body;

    db.query(`INSERT INTO sponsor(nome, logo) VALUES ('${nome}', '${logo}');`,(err, results)=>{
        if(err){
            console.log(err);
        }else{
            console.log('ok');
        }
    })
}