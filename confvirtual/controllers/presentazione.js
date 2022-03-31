const mysql = require('mysql');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.formPresentazione = (req, res)=>{
    db.query('SELECT titolo, id_sessione, anno, acronimo FROM sessione, programma_giornaliero WHERE programma=id_programma', function(err,result,fields){
        if(err) throw err;
        else 
        res.render('newpresentazione', {sessioni: result});
    });
}


exports.creaPresentazione = (req,res)=>{
    console.log(req.body);
    const {oraI, oraF, ordine, sessioneConferenza} = req.body;
    

    db.query(`INSERT INTO presentazione(ora_i, ora_f, ordine, sessione) VALUES ('${oraI}','${oraF}','${ordine}','${sessioneConferenza}');`,(err, results)=>{
        if(err){
            console.log(err);
        }else{
            console.log('ok');
        }
    })
}