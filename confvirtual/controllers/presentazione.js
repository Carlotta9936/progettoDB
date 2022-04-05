const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../connectionDB');


exports.formPresentazione = (req, res)=>{
    //così vedo però solo le sessioni che hanno già delle presentazioni, io invece devo vedere tutte le sessioni!!
    let sql=`select sessione.titolo as sessione, programma_giornaliero.data as data, conferenza.nome as conferenza, sessione.id_sessione as id
             from sessione,programma_giornaliero, conferenza,(select count(sessione) as numero, sessione as nome
                                                 from presentazione
                                                 group by (presentazione.sessione))as sessioni
             where sessione.id_sessione=sessioni.nome and sessione.num_presentazioni!=sessioni.numero and
             programma_giornaliero.id_programma=sessione.programma and (programma_giornaliero.anno=conferenza.anno
             and programma_giornaliero.acronimo=conferenza.acronimo)`
    db.query(sql,function(err,results){
    if(err) throw err;
    console.log(results);
    res.render('newpresentazione', {sessioni: results});
    });
}


exports.creaPresentazione = (req,res)=>{
    console.log(req.body);
    const {oraI, oraF, ordine, sessioneConferenza} = req.body;
    db.query(`INSERT INTO presentazione(ora_i, ora_f, ordine, sessione) VALUES ('${oraI}','${oraF}','${ordine}','${sessioneConferenza}');`,(err, results)=>{
        if(err){
            console.log(err);
        }else{
            console.log(results);
            console.log(tipo);
            res.redirect(tipo+'/'+this.id_presentazione);
        }
    })
}

exports.creaArticolo=(req,res)=>{
    res.render('newarticolo');

}

exports.creaTutorial=(req,res)=>{
    res.render('newtutorial');

}