const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../connectionDB');
const jwt = require('jsonwebtoken');

exports.formConferenza = (req, res)=>{
    var decoded = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
    if(decoded.diritti === "Admin"){    //Controllo ruolo dell'utente
        res.render('newconferenza');
    } else {
        res.send("Mi dispiace, per creare una conferenza bisogna essere un amministratore");
    }
}
//creo una nuova conferenza
//fatto
exports.creaConferenza = (req,res,next)=>{
    console.log(req.body);
    const {acronimo, anno, logo, dataInizio, dataFine, nome, creatore} = req.body;
    if(dataFine>dataInizio){    //Controllo sulle date
        console.log("OK");
        db.query(`call insertconferenza('${acronimo}','${anno}', '${logo}', '${dataInizio}','${dataFine}','${nome}','${creatore}');`,(err,results)=>{
            if(err) {throw err}
                else {
                    console.log("ok");
                    //reindirizzamento a creare sessioni
                    next();
                } 
        }); 
    } else {    //Nel caso le date messe non vadano bene allora renderizza la pagina per creare una conferenza
        res.render('newconferenza');        //Messaggio di errore per le date
    }
}

//creazione automatica della tabella programma_giornaliero in base ai giorni della conferenza
exports.creaProgramma= (req,res)=>{
    let firstDate = new Date(req.body.dataInizio),
    secondDate = new Date(req.body.dataFine),
    timeDifference = Math.abs(secondDate.getTime() - firstDate.getTime());
    let differentDays = Math.ceil(timeDifference / (1000 * 3600 * 24) + 1);
    for(let i=0;i<differentDays;i++){

        let data= new Date(firstDate.getTime()+((1000 * 3600 * 24)*i)).toISOString().slice(0,19).replace('T', ' ');
        console.log(data);
        //fatto
        //db.query(`INSERT INTO programma_giornaliero(acronimo, anno, data) VALUES ('${req.body.acronimo}','${req.body.anno}', '${data}');`,(err, results)=>{
        db.query(`call insertprogramma('${req.body.acronimo}','${req.body.anno}', '${data}');`,(err, results)=>{  
            if(err) {throw err}
            else {
                console.log("ok");
            }
        });
    }
    res.redirect('/conferenza/nuovaConferenza2-3/'+req.body.acronimo+'/'+req.body.anno);
}
//richiamo visualizzazione per creare sessioni nei vari programmi giornalieri di una conferenza
exports.formSessione = (req, res)=>{
    db.query(`call selectprogramma ('${req.params.anno}','${req.params.acronimo}');`,(err, results)=>{
        if(err) throw err;
        else{
            console.log({results});
            res.render('newsessione', {programmi: results[0]});
        }
    });
}

//creo le sessioni
exports.creaSessione = (req,res)=>{
    console.log(req.body);
    const {oraI, oraF, titolo, link} = req.body;
    //fatto
   // db.query(`INSERT INTO sessione(ora_f, ora_i, titolo, link, num_presentazioni, programma) VALUES ('${oraF}','${oraI}','${titolo}','${link}','${num}','${req.params.programma}');`,(err, results)=>{
    db.query(`call insertsessione ('${oraF}','${oraI}','${titolo}','${link}','${req.params.programma}');`,(err, results)=>{
        if(err){
            console.log(err);
        }
    })
}

//visualizzazione specifica di una conferenza
exports.programma = (req,res)=>{
    //fatto
    //query di verifica esista la conferenza richiesta
    db.query(`call verificaconferenza('${req.params.anno}','${req.params.acronimo}');`,(err,results)=>{
        if(err) throw err;
        if (results[0].length==0){
            res.render('conferenzaInesistente',{nome: req.params.acronimo, anno:req.params.anno});
        }else{
            //vado a prendere le speicifiche con programmi e sessioni si una conferenza
            db.query(`call specificaconferenza('${req.params.anno}','${req.params.acronimo}');`,(err,result)=>{
                if(err) throw err;
                console.log("ciao"+{result});
                //verifica che la conferenza abbia un programma da viasualizzare
                if (result[0].length>0){
                    //query per visulizzare gli sponsor
                    db.query(`call visualizzasponsor('${req.params.anno}','${req.params.acronimo}');`,(err,results)=>{
                        if(err) throw err;
                        console.log({results});
                        res.render('conferenza',{conferenze: result[0], sponsors: results[0]});

                    });
                        
                }
                else{
                    console.log("totta");
                    res.render('conferenzaVuota',{nome: req.params.acronimo, anno:req.params.anno});
                }
            });
        }
    });
}

//visualizzazione conferenze disponibili
exports.disponibile=(req,res)=>{
    db.query(`call conferenzedisponibili ();`,(err,results)=>{
        if(err) throw err;
        console.log({results});

        res.render('conferenzeAttive',{conferenze: results[0] });
    });

}
//visualizzazioni per inserire un nuova sponsorizazione ad una conferenza
exports.formSponsorizzazione=(req,res)=>{
    //query per visulizzare tutti gli sponsor
    db.query(`call nomesponsor();`,(err,results)=>{
        if(err) throw err;
        console.log({results});
        res.render('newsponsorizzazione', {acronimo: req.params.acronimo, anno: req.params.anno, sponsor: results[0]});
    });
}

exports.creaSponsorizzazione=(req,res)=>{
    const { importo, sponsor} = req.body;
    //query per inserire una nuova sponsorizzazione
    db.query(`call insertsponsorizzazione ('${importo}','${req.params.anno}', '${req.params.acronimo}', '${sponsor}');`,(err,results)=>{
        if(err) {throw err};
    });
    //query per contare gli sponsor della conferenza
    db.query(`call contasponsor('${req.params.anno}','${req.params.acronimo}')`,(err,results)=>{
        console.log(results[0]);
        if(results[0][0].num_sponsorizzazioni>=5){
            //vengo mandato alla specifica della conferenza
            res.redirect('/conferenza/'+req.params.acronimo+'/'+req.params.anno);
        }
    });
    
}

exports.segui = (req, res) => {
    var decoded = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decoded.username);
    //fatto
    //db.query(`INSERT INTO iscrizione (iscrizione_anno, iscrizione_acronimo, iscrizione_username) VALUES ('${req.params.anno}', '${req.params.acronimo}', '${decoded.username}');`, (err, results) => {
    db.query(`call insertsegui ('${req.params.anno}', '${req.params.acronimo}', '${decoded.username}');`,(err,results)=>{
        if(err) {throw err}
        else {
        console.log("Si cazzo");
        }
    });
}