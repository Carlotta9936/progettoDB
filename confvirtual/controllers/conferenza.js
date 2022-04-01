const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../connectionDB');


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


exports.programma = (req,res)=>{
    let sql = `(select conferenza.nome as nome, conferenza.acronimo as acronimo, conferenza.anno as anno, conferenza.creatore as creatore, conferenza.datainizio as datainizio, conferenza.datafine as datafine, conferenza.logo as logo, programma_giornaliero.data as data, sessione.link as link, sessione.ora_i as orai, sessione.titolo as titolosessione, sessione.ora_f as oraf, articolo.titolo as titolo
        from conferenza inner join programma_giornaliero on (conferenza.anno=programma_giornaliero.anno and conferenza.acronimo=programma_giornaliero.acronimo)
        inner join sessione on( programma_giornaliero.id_programma=sessione.programma)
        inner join presentazione on(sessione.id_sessione= presentazione.sessione)
        inner join articolo on (presentazione.id_presentazione=articolo.id_articolo)
        where conferenza.anno= "${req.params.anno}" and conferenza.acronimo="${req.params.acronimo}" ) union
        (select conferenza.nome as nome, conferenza.acronimo as acronimo, conferenza.anno as anno, conferenza.creatore as creatore, conferenza.datainizio as datainizio, conferenza.datafine as datafine, conferenza.logo as logo, programma_giornaliero.data as data, sessione.link as link, sessione.ora_i as orai, sessione.titolo as titolosessione, sessione.ora_f as oraf, tutorial.titolo as titolo
        from conferenza inner join programma_giornaliero on (conferenza.anno=programma_giornaliero.anno and conferenza.acronimo=programma_giornaliero.acronimo)
        inner join sessione on( programma_giornaliero.id_programma=sessione.programma)
        inner join presentazione on(sessione.id_sessione= presentazione.sessione)
        inner join tutorial on (presentazione.id_presentazione=tutorial.id_tutorial)
        where conferenza.anno="${req.params.anno}"  and conferenza.acronimo="${req.params.acronimo}" )`;
    db.query(sql, function(err, results){
        if(err) throw err;
        console.log("ciao"+results);

        res.render('conferenza',{conferenze: results});
    });

}

exports.disponibile=(req,res)=>{
    let sql = `select conferenza.nome as nome, conferenza.acronimo as acronimo, conferenza.anno as anno, conferenza.datainizio as datainizio, conferenza.datafine as datafine
                from conferenza
                where conferenza.svolgimento='attiva'`;
    db.query(sql, function(err, results){
        if(err) throw err;
        console.log({results});

        res.render('conferenzeAttive',{conferenze: results });
    });

}