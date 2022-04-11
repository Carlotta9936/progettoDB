const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../connectionDB');
const jwt = require('jsonwebtoken');
const controlloDate = require('../modules/controlloDate');

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
    var decoded = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
    const {acronimo, anno, logo, dataInizio, dataFine, nome, creatore} = req.body;
    if(controlloDate.controlloDate(dataInizio, dataFine)){    //Controllo sulle date
        console.log("OK");
        db.query(`call insertconferenza('${acronimo}','${anno}', '${logo}', '${dataInizio}','${dataFine}','${nome}','${decoded.username}');`,(err,results)=>{
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
//richiamo visualizzazione pre creare sessioni nei vari programmi giornalieri di una conferenza
exports.formSessione = (req, res)=>{
    //fatto
    /*db.query(`SELECT * 
    FROM programma_giornaliero
     WHERE programma_giornaliero.anno='${req.params.anno}' and programma_giornaliero.acronimo='${req.params.acronimo}';`,(err,results)=>{
    */
        console.log(req.params.anno);
        console.log(req.params.acronimo);
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
            //console.log(results[0]);
            res.render('conferenzaInesistente',{nome: req.params.acronimo, anno:req.params.anno});
        }else{
            //fatto
            //vado a prendere le speicifiche con programmi e sessioni si una conferenza
            /*let sql = `select conferenza.nome as nome, conferenza.acronimo as acronimo, conferenza.anno as anno, conferenza.creatore as creatore, conferenza.datainizio as datainizio, conferenza.datafine as datafine, conferenza.logo as logo, programma_giornaliero.data as data, sessione.link as link, sessione.ora_i as orai, sessione.titolo as titolosessione, sessione.ora_f as oraf, programma_giornaliero.data as data, sessione.id_sessione as sessione
                from conferenza inner join programma_giornaliero on (conferenza.anno=programma_giornaliero.anno and conferenza.acronimo=programma_giornaliero.acronimo)
                inner join sessione on( programma_giornaliero.id_programma=sessione.programma)
                where conferenza.anno= "${req.params.anno}" and conferenza.acronimo="${req.params.acronimo}"`;
                db.query(sql, function(err, results){*/
                db.query(`call specificaconferenza('${req.params.anno}','${req.params.acronimo}');`,(err,result)=>{
                    if(err) throw err;
                    console.log("ciao"+{result});
                    //verifica che la conferenza abbia un programma da viasualizzare
                    if (result[0].length>0){
                        //query per visulizzare gli sponsor
                        //fatto
                       /* let sqlsponsor=`select sponsor.nome
                        from conferenza, sponsor, sponsorizzazione
                        where conferenza.svolgimento='attiva' and conferenza.anno= "${req.params.anno}"
                        and conferenza.acronimo= "${req.params.acronimo}"
                        and conferenza.anno=sponsorizzazione.annoConf 
                        and conferenza.acronimo=sponsorizzazione.acronimoConf
                        and sponsorizzazione.nome_sponsor=sponsor.nome`;
                        db.query(sqlsponsor, function(err, result){*/
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
    //fatto
    /*let sql = `select conferenza.nome as nome, conferenza.acronimo as acronimo, conferenza.anno as anno, conferenza.datainizio as datainizio, conferenza.datafine as datafine
                from conferenza
                where conferenza.svolgimento='attiva'`;
    db.query(sql, function(err, results,next){*/
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
    //query per contare gli sponsor della conferenza
    db.query(`call contasponsor('${req.params.anno}','${req.params.acronimo}')`,(err,results)=>{
        if(results[0]<5){
            const { importo, sponsor} = req.body;
            //query per inserire una nuova sponsorizzazione
            db.query(`call insertsponsorizzazione ('${importo}','${req.params.anno}', '${req.params.acronimo}', '${sponsor}');`,(err,results)=>{
                if(err) {throw err};
            });
        }else{
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