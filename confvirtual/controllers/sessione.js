const mysql = require('mysql');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.formSessione = (req, res)=>{
    db.query('SELECT * FROM programma_giornaliero', function(err,result,fields){
        if(err) throw err;
        else 
        //console.log(result);
        res.render('newsessione', {programmi: result});
    });
}

exports.creaSessione = (req,res)=>{
    console.log(req.body);
    const {oraI, oraF, titolo, link, num, programma} = req.body;
    //console.log(programma);

    db.query(`INSERT INTO sessione(ora_f, ora_i, titolo, link, num_presentazioni, programma) VALUES ('${oraF}','${oraI}','${titolo}','${link}','${num}','${programma}');`,(err, results)=>{
        if(err){
            console.log(err);
        }else{
            console.log('ok');
        }
    })
}