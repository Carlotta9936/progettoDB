const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../connectionDB');


exports.formPresentazione = (req, res)=>{
    //query per visualizzare le sessioni non ancora piene
    let sql=`select sessione.titolo as sessione,
    programma_giornaliero.data as data, conferenza.nome as conferenza, conferenza.acronimo as acronimo, sessione.id_sessione as id
    from sessione, programma_giornaliero, conferenza
    where programma_giornaliero.id_programma=sessione.programma and (programma_giornaliero.anno=conferenza.anno and
    programma_giornaliero.acronimo=conferenza.acronimo) and sessione.id_sessione not in (select sessione.id_sessione
                                                                                         from sessione, (select count(sessione) as num, sessione
                                                                                                        from presentazione
                                                                                                        group by (presentazione.sessione))as sessioni
                                                                                         where sessione.num_presentazioni=sessioni.num and sessioni.sessione=sessione.id_sessione)`
    db.query(sql,function(err,results){
        if(err) throw err;
        res.render('newpresentazione', {sessioni: results});
    });
}


exports.creaPresentazione = (req,res)=>{
    console.log(req.body);
    let {oraI, oraF, ordine, sessioneConferenza, tipo} = req.body;
    db.query(`INSERT INTO presentazione(ora_i, ora_f, ordine, sessione) VALUES ('${oraI}','${oraF}','${ordine}','${sessioneConferenza}');`,(err, results)=>{
        if(err){
            console.log(err);
        }else{
            tipo=req.body.tipo;
            oraI=String(req.body.oraI+':00');
            oraF=String(req.body.oraF+':00');
            ordine= req.body.ordine;
            let sql=`select max(presentazione.id_presentazione) as presentazione
                     from presentazione`
            db.query(sql,function(err, results){
                if(err){
                    //console.log(results);
                    console.log(err);
                }else{
                    console.log(req.body.tipo);
                    res.redirect(tipo+'/'+results[0].presentazione);
                }
            });
        }
    })
}
//view per la creazione di articoli
exports.formArticolo=(req,res)=>{
    res.render('newarticolo',{articolo: req.params.id_articolo});
}

//creao articolo senza l'assegnazione del presenter
exports.creaArticolo=(req,res)=>{
    const {PDF, pagine, titolo}= req.body;
    db.query(`INSERT INTO articolo(id_articolo, pdf , stato,n_pagine, titolo) VALUES ('${req.params.id_articolo}','${PDF}','non coperto','${pagine}','${titolo}');`,(err, result)=>{
        if(err){
            console.log(err);
        }else{
            //vado a controllare che gli autori dell'articolo esistano sul db, se non esistono devo crearli
            let sql= (`select * from autore`);
            db.query(sql,function(err,results){
                if(err){
                    console.log(err);
                }else{
                    if(results.length==0){
                        res.render('newautore',{titolo: titolo, articolo: req.params.id_articolo})
                    }else{
                        console.log(req.params.id_articolo);
                        res.render('assegnaAutori',{titolo: titolo, autori: results, articolo: req.params.id_articolo})
                    }
                }
            });
        }
    });
}

exports.formTutorial=(req,res)=>{
    res.render('newtutorial');

}

exports.creaTutorial=(req,res)=>{
    res.render('newtutorial');

}

/*exports.assegnaAutori=(req,res)=>{
    res.render('index');
}*/

