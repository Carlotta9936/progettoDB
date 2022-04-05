const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../connectionDB');

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

exports.specificaSessione=(req,res)=>{
    //query che controlla la sessione abbia già delle presentazioni
    let sqlverifica=`select *
    from presentazione, sessione
    where presentazione.sessione=sessione.id_sessione and sessione.id_sessione= "${req.params.id_sessione}"`;
    db.query(sqlverifica,function(err,results){
        if(err) throw err;
        if (results.length==0){
            console.log(req.params.titolo);
            res.render('sessioneVuota',{titolo: req.params.titolo});
        }else{
            let sql=`(select articolo.titolo as titolo, presentazione.ora_f as oraf, presentazione.ora_i as orai, sessione.titolo as titolosessione
            from articolo, sessione, presentazione
            where presentazione.sessione=sessione.id_sessione and sessione.id_sessione= "${req.params.id_sessione}" and articolo.id_articolo=presentazione.id_presentazione)union
            (select tutorial.titolo as titolo, presentazione.ora_f as oraf, presentazione.ora_i as orai, sessione.titolo as titolosessione
                from tutorial, sessione, presentazione
                where presentazione.sessione=sessione.id_sessione and sessione.id_sessione= "${req.params.id_sessione} and tutorial.id_tutorial=presentazione.id_presentazione")`;
            db.query(sql,function(err,results){
                if(err) throw err;
                console.log(results[0].oraf);
                res.render('sessione',{presentazioni: results});

            });
        }
    });
}