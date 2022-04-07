const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../connectionDB');


exports.formPresentazione = (req, res)=>{
    //fatto
    //query per visualizzare le sessioni non ancora piene
    /*let sql=`select sessione.titolo as sessione, conferenza.anno as anno, conferenza.acronimo as acronimo, programma_giornaliero.data as data, sessione.id_sessione as id
    from sessione, conferenza, programma_giornaliero
    where sessione.programma=programma_giornaliero.id_programma and
    programma_giornaliero.anno=conferenza.anno and conferenza.acronimo=programma_giornaliero.acronimo
    and conferenza.svolgimento='attiva'`
    db.query(sql,function(err,results){*/
    db.query(`call sessionidisponibili ()`,(err,results)=>{
        if(err) throw err;
        console.log({results});
        res.render('newpresentazione', {sessioni: results[0]});
    });
}


exports.creaPresentazione = (req,res)=>{
    console.log(req.body);
    let {oraI, oraF, ordine, sessioneConferenza, tipo} = req.body;
    //fatto
    //db.query(`INSERT INTO presentazione(ora_i, ora_f, ordine, sessione) VALUES ('${oraI}','${oraF}','${ordine}','${sessioneConferenza}');`,(err, results)=>{
      db.query(`call insertpresentazione('${oraI}','${oraF}','${ordine}','${sessioneConferenza}');`,(err,results)=>{
        if(err){
            console.log(err);
        }else{
            tipo=req.body.tipo;
            //fattp
            //query per prendere l'ultima presentazione creata
            /*let sql=`select max(presentazione.id_presentazione) as presentazione
                     from presentazione`
            db.query(sql,function(err, results){*/
            db.query(`call selezionapresentazione ()`,(err,results)=>{
                //non funziona
                if(err){
                    //console.log(results);
                    console.log(err);
                }else{
                    console.log(results[0]);
                    res.redirect(tipo+'/'+results[0][0].id);
                }
            });
        }
    })
}
//view per la creazione di articoli
exports.formArticolo=(req,res)=>{
    console.log(req.params.id_articolo);
    res.render('newarticolo',{articolo: req.params.id_articolo});
}

//creao articolo senza l'assegnazione del presenter
exports.creaArticolo=(req,res)=>{
    const {PDF, pagine, titolo}= req.body;
    //fatto
    //db.query(`INSERT INTO articolo(id_articolo, pdf , stato,n_pagine, titolo) VALUES ('${req.params.id_articolo}','${PDF}','non coperto','${pagine}','${titolo}');`,(err, result)=>{
    db.query(`call insertarticolo (${req.params.id_articolo}','${PDF}','${pagine}','${titolo}')`,(err,results)=>{
        if(err){
            console.log(err);
        }else{
            //fatto
            //vado a controllare che gli autori dell'articolo esistano sul db, se non esistono devo crearli
           /* let sql= (`select * from autore`);
            db.query(sql,function(err,results){*/
            db.query(`call visulizzaautori ()`,(err,results)=>{
                if(err){
                    console.log(err);
                }else{
                    if(results.length==0){
                        res.render('newautore',{titolo: titolo, articolo: req.params.id_articolo})
                    }else{
                        console.log(req.params.id_articolo);
                        res.render('assegnaAutori',{titolo: titolo, autori: results[0], articolo: req.params.id_articolo})
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

