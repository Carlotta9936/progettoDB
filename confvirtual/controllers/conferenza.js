const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../connectionDB');
const jwt = require('jsonwebtoken');
const controlloDate = require('../modules/controlloDate');
const { DateTime } = require('luxon');
const {updateLog} = require('../modules/connectionDBMongo');
var errore= false;

exports.formConferenza = (req, res)=>{
    var decoded = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
    if(decoded.diritti === "Admin"){    //Controllo ruolo dell'utente
        res.render('newconferenza',{error: errore, msg: "non hai l'autorizzazione per questa azione"});
    } else {
        res.send("Mi dispiace, per creare una conferenza bisogna essere un amministratore");
    }
}
//creo una nuova conferenza
exports.creaConferenza = (req,res,next)=>{
    var decoded = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
    const {acronimo, anno, dataInizio, dataFine, nome} = req.body;
    console.log(req.files.length);
    //Se non carica l'immagine mette l'immagine di default
    if(req.files.length !== null){
        var logo = req.files.logo[0].filename;
    } else {
        var logo = "logoConferenzaDefault.png";
    }
    if(controlloDate.controlloDate(dataInizio, dataFine)){    //Controllo sulle date
        db.query(`call insertconferenza('${acronimo}','${anno}', '${logo}', '${dataInizio}','${dataFine}','${nome}','${decoded.username}');`,(err,results)=>{
        
            if(err) {
                if (err.code === 'ER_DUP_ENTRY'){   
                    console.log("we");
                    errore=true;
                    res.render('newconferenza',{error: errore, msg: "conferenza già esistente"});
                }else { throw err;}
            }
            console.log(err);
            //query per iscrivere l'admin alla conferenza creata
            db.query(`call addadminconferenza ('${decoded.username}','${anno}','${acronimo}')`,(err,result)=>{
                if(err) {throw err};
            });
            //reindirizzamento a creare sessioni
            next();
        }); 
    }else{
        res.render('newconferenza',{error: true, msg: "ricontrolla le date"});
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
        //query per inserire un nuovo programma giornaliero
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
            for(var i = 0; i < results[0].length; i++) {
                results[0][i].data = DateTime.fromJSDate(results[0][i].data).toLocaleString(DateTime.DATE_MED);
            }
            res.render('newsessione', {programmi: results[0], error: false, msg:""});
        }
    });
}

//creo le sessioni
exports.creaSessione = (req,res)=>{
    console.log(req.body);
    const {oraI, oraF, titolo, link} = req.body;
    //query per controllare se ci sono sessioni negli orari inseriti
    db.query(`call orariSessione ('${req.params.programma}')`,(err,result)=>{
        if(err){throw err;}
        console.log("res",result[0]);
        db.query(`call selectprogramma ('${req.params.anno}','${req.params.acronimo}');`,(err, results)=>{
            if(err) throw err;
            console.log({results});
            for(var i = 0; i < results[0].length; i++) {
                results[0][i].data = DateTime.fromJSDate(results[0][i].data).toLocaleString(DateTime.DATE_MED);
            }
            //Controllo che non sia una programma vuoto
            if(result[0]!=0){
                var errorOra = false;
                var mex = "Sessione creata con successo";
                //Controllo orario
                result[0].forEach((orari)=>{
                    console.log("ciao");
                    if(!(oraF<orari.ora_i || oraI>orari.ora_f)){
                        errorOra = true;
                        mex = "esiste già una sessione in questo orario"
                    }
                });

                if(errorOra===false){
                    //controllo se l'ora inizio è prima della fine
                    if(oraI<oraF){
                        //query per inserire una nuova sessione
                        db.query(`call insertsessione ('${oraF}','${oraI}','${titolo}','${link}','${req.params.programma}');`,(err, result)=>{
                            if(err){throw err;}
                        });
                    }else{
                        errorOra = true;
                        mex= "l'orario di fine session non può essere prima dell'ra d'inizio";
                    }
                }
                //Renderizzo la pagina
                res.render('newsessione', {programmi: results[0], error: errorOra, msg: mex});
                
                 
            }else{//Non ci sono ancora sessioni
                //controllo se l'ora inizio è prima della fine
                if(oraI<oraF){
                    //query per inserire una nuova sessione
                    db.query(`call insertsessione ('${oraF}','${oraI}','${titolo}','${link}','${req.params.programma}');`,(err, result)=>{
                        if(err){throw err;}
                        console.log("terzo");
                        res.render('newsessione', {programmi: results[0], error: false, msg:"sessione creata"});
                    }); 
                }else{
                    res.render('newsessione', {programmi: results[0], error: true, msg: "l'orario di fine session non può essere prima dell'ra d'inizio"});

                }
            }
        });
    });
}

//visualizzazione specifica di una conferenza
exports.programma = (req,res)=>{
    var segui=true; //variabile per seguire conferenze
    //query che verifica che la conferenza richiesta sia attiva
    db.query(`call verificaconferenza('${req.params.anno}','${req.params.acronimo}');`,(err,results)=>{
        if(err) throw err;
        if (results[0].length==0){
            res.render('conferenzaInesistente',{nome: req.params.acronimo, anno:req.params.anno});
        }else{
            //vado a prendere le specifiche con programmi e sessioni di una conferenza
            db.query(`call specificaconferenza ('${req.params.anno}', '${req.params.acronimo}');
                call getAssociati ('${req.params.anno}', '${req.params.acronimo}');
                call getProgrammaGiornaliero ('${req.params.anno}', '${req.params.acronimo}');
                call getNumeroIscritti ('${req.params.anno}', '${req.params.acronimo}');
                call visualizzaSponsor ('${req.params.anno}', '${req.params.acronimo}');`, (err, results) => {
                if(err) {throw err;}
                //Log
                var decoded = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
                updateLog(`${decoded.log}`, {conferenzeGuardate: `${req.params.acronimo} ${req.params.anno}`})
                
                //Controllo se l'utente ha il diritto di modificare
                var modifica = false;
                console.log("Primo: ", results);
                console.log("Secondo: ", results[2]);

                for(var i = 0; i < results[2].length; i++){
                    console.log("Qi" + decoded.username + "  " + results[2][i].associazione_username)
                    if(results[2][i].associazione_username === decoded.username) { 
                        modifica = true;
                    }
                }

                //verifica che la conferenza abbia un programma da visualizzare
                console.log(results[0]);
                if (results[0].length>0){
                    results[0][0].datainizio = DateTime.fromJSDate(results[0][0].datainizio).toLocaleString(DateTime.DATE_MED);
                    results[0][0].datafine = DateTime.fromJSDate(results[0][0].datafine).toLocaleString(DateTime.DATE_MED);
                    for(var i = 0; i < results[0].length; i++){
                        results[0][i].data = DateTime.fromJSDate(results[0][i].data).toLocaleString(DateTime.DATE_MED);
                    }
                    
                    //Pulisco le date del programma giornaliero
                    for(var i = 0; i<results[4].length; i++){
                        results[4][i].data = DateTime.fromJSDate(results[4][i].data).toLocaleString(DateTime.DATE_MED);
                    }
                    console.log(results[2]);
                    //controllo se l'utente è già iscritto alla conferenza
                    db.query(`call controllaiscrizione('${decoded.username}','${req.params.anno}','${req.params.acronimo}')`,(err,result)=>{
                        if(err) throw err;       
                        if(result[0].length!=0){
                            segui=false;
                        }    
                        var risultati=[];
                        var i=0;
                        const today= new Date();
                        const giorno= DateTime.fromJSDate(today).toLocaleString(DateTime.DATE_MED);
                        const orario= today.toLocaleTimeString();//prendo l'ora attuale

                        results[0].forEach((sessione)=>{
                            if(sessione.data==giorno){
                                if(sessione.orai<orario && orario<sessione.oraf){
                                    risultati[i]=true;
                                }
                                else{
                                    risultati[i]=false;
                                }
                            }else{
                                risultati[i]=false;
                            }
                            i++;
                        });
                        console.log("confe",results[0]);
                    
                        //Renderizzo tutto
                        res.render('conferenza',{conferenze: results[0], giorni: results[4], moderatori: results[2], permessi: modifica, sponsors: results[8], numIscritti: results[6][0].numIscritti, segui: segui, ris: risultati});
    
                    });
                   
    
                } else {
                    console.log("conferneza vuota");
                    console.log("Sono qui 1");
                    res.render('conferenzaVuota',{nome: req.params.acronimo, anno:req.params.anno, admin: modifica});
                }
            })
        }
    });
}

//visualizzazione conferenze disponibili
exports.disponibile=(req,res)=>{
    var decoded = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decoded.diritti);
    var aggiungiConferenza = decoded.diritti === "Admin"? true : false;
    db.query(`call conferenzedisponibili ();`,(err,results)=>{
        if(err) throw err;
        console.log(results[0]);
        for(var i = 0; i < results[0].length; i++){
            results[0][i].datainizio = DateTime.fromJSDate(results[0][i].datainizio).toLocaleString(DateTime.DATE_MED);
            results[0][i].datafine = DateTime.fromJSDate(results[0][i].datafine).toLocaleString(DateTime.DATE_MED);
        }
        res.render('conferenzeAttive',{conferenze: results[0], admin: aggiungiConferenza});
    });

}
//visualizzazioni per inserire un nuova sponsorizazione ad una conferenza
exports.formSponsorizzazione=(req,res)=>{
    //query per visulizzare tutti gli sponsor
    db.query(`call nomesponsor();`,(err,results)=>{
        if(err) throw err;
        console.log({results});
        db.query(`call contasponsor('${req.params.anno}','${req.params.acronimo}')`,(err,result)=>{
            if(err) throw err;
            console.log("contaSponsor"+result[0]);
            if(result[0]!=0){
                res.render('newsponsorizzazione', {acronimo: req.params.acronimo, anno: req.params.anno,error: false, msg: "", sponsor: results[0], num: result[0][0].num_sponsorizzazioni});
            }
            else{
                res.render('newsponsorizzazione', {acronimo: req.params.acronimo, anno: req.params.anno,error: false, msg: "", sponsor: results[0], num: ""});
            }
        });
    });
}

exports.creaSponsorizzazione=(req,res)=>{
    errore=false;
    const { importo, sponsor} = req.body;
    console.log("Anno", req.params.anno)
    console.log("acronimo", req.params.acronimo)
    if(importo!=""){
        //query per inserire una nuova sponsorizzazione
        db.query(`call insertsponsorizzazione ('${importo}','${req.params.anno}', '${req.params.acronimo}', '${sponsor}');`,(err,results)=>{
            if(err) {throw err;}
            db.query(`call nomesponsor();`,(errr,results)=>{
                if(err){
                    if (err.code === 'ER_DUP_ENTRY'){   
                        console.log("we");
                        errore=true;
                        res.render('newsponsorizzazione',{acronimo: req.params.acronimo,anno: req.params.anno, error: errore, msg: "sponsor già esistente",sponsor: results[0], num: "1"});//l'1 serve per evitare che dia errore
                    }else{ throw err; }
                    
                }else{
                    res.render('newsponsorizzazione',{acronimo: req.params.acronimo,anno: req.params.anno, error: errore, msg: "nuova sponsorizzazione creata",sponsor: results[0], num:"1"});//l'1 serve per evitare che dia errore

                }
            });
        });
        //query per contare gli sponsor della conferenza
        db.query(`call contasponsor('${req.params.anno}','${req.params.acronimo}')`,(err,results)=>{
            console.log("contaSponsor");
            if(results[0][0].num_sponsorizzazioni>=5){
                //vengo mandato alla specifica della conferenza
                res.redirect('/conferenza/'+req.params.acronimo+'/'+req.params.anno);
            }
        });
    } else{
        db.query(`call nomesponsor();`,(err,results)=>{
            if(err){ throw err; }
            errore=true;
            res.render('newsponsorizzazione',{acronimo: req.params.acronimo,anno: req.params.anno, error: errore, msg: "inserire un importo valido",sponsor: results[0], num: ""});

        });

    }   
}

exports.segui = (req, res) => {
    var decoded = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
    db.query(`call insertsegui ('${req.params.anno}', '${req.params.acronimo}', '${decoded.username}');`,(err,results)=>{
        if(err) {throw err}
        else {
            //Log
            //updateLog(`${decoded.log}`, {conferenzeGuardate: `${req.params.acronimo} ${req.params.anno}`})
            updateLog(`${decoded.log}`, {conferenzeSeguite: `${req.params.acronimo} ${req.params.anno}`})
            console.log("Si cazzo");
            res.redirect("/conferenza/"+req.params.acronimo+"/"+req.params.anno);
        }
    });
}

exports.modificaConferenza = (req, res) => {
    db.query(`call getAdminLiberi('${req.params.anno}', '${req.params.acronimo}')`, (err, results) => {
        console.log(results[0]);
        if(results[0]==0){
            res.render("modificaConferenza", {admins: results[0],acronimo: req.params.acronimo, anno: req.params.anno, errore: true, msg: "Tutti gli admin sono già stati associati"});
        }else{
            res.render("modificaConferenza", {admins: results[0],acronimo: req.params.acronimo, anno: req.params.anno, errore: false, msg: ""});
        }
    });
} 

exports.aggiungiAdmin = (req, res) => {
    const {admin} = req.body;
    db.query(`call aggiungiAssociazioni('${admin}', '${req.params.anno}', '${req.params.acronimo}');`, (err, results) => {
        if(err) {throw err;}
        db.query(`call getAdminLiberi('${req.params.anno}', '${req.params.acronimo}')`, (err, results) => {
            console.log(results[0]);
            if(results[0]==0){
                res.render("modificaConferenza", {admins: results[0],acronimo: req.params.acronimo, anno: req.params.anno, errore: true, msg: "Moderatore associato: "+admin+" ATTENZIONE gli admin sono già tutti associati"});
    
            }else{
            res.render("modificaConferenza", {admins: results[0],acronimo: req.params.acronimo, anno: req.params.anno, errore: false, msg: "Moderatore associato"+admin});
            }
        });
    })
}

exports.ricercaConferenza =(req,res)=>{
    var modifica = false; //variabile per gestire i permessi di modifica
    var segui=true; //variabile per seguire una conferenza
    //query che verifica che la conferenza richiesta sia attiva
    db.query(`call cercaconferenza('${req.params.anno}','${req.params.acronimo}');`,(err,results)=>{
        if(err) throw err;
        if (results[0].length==0){
            res.render('conferenzaInesistente',{nome: req.params.acronimo, anno:req.params.anno});
        }else{
            //vado a prendere le specifiche con programmi e sessioni di una conferenza
            db.query(`call datiConferenza('${req.params.anno}', '${req.params.acronimo}')`, (err, results) => {
                if(err) {throw err;}
                console.log("ciao");
                //verifica che la conferenza abbia un programma da visualizzare
                if (results[0].length>0){
                    results[0][0].datainizio = DateTime.fromJSDate(results[0][0].datainizio).toLocaleString(DateTime.DATE_MED);
                    results[0][0].datafine = DateTime.fromJSDate(results[0][0].datafine).toLocaleString(DateTime.DATE_MED);
                    for(var i = 0; i < results[0].length; i++){
                        console.log("bellla");
                        results[0][i].data = DateTime.fromJSDate(results[0][i].data).toLocaleString(DateTime.DATE_MED);
                    }
                    /*console.log(results[0]);
                    console.log(results[1]);
                    console.log(results[2]);
                    console.log(results[3]);
                    console.log(results[4]);*/

                    //Controllo se l'utente ha il diritto di modificare
                    var decoded = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET); 
                    var modifica = false;                   
                    for(var i = 0; i < results[1].length; i++){
                        console.log(decoded.username + "  " + results[1][i].associazione_username)
                        if(results[1][i].associazione_username === decoded.username) { 
                            modifica=true;
                        }
                    }
                    //Pulisco le date del programma giornaliero
                    for(var i = 0; i<results[2].length; i++){
                        results[2][i].data = DateTime.fromJSDate(results[2][i].data).toLocaleString(DateTime.DATE_MED);
                    }
                    console.log(results[0][0]);
                    //controllo se la conferenza è già completata
                    if(results[0][0].svolgimento=="completata"){
                        modifica = false;
                        segui=false;
                    }
                    //controllo se l'utente è già iscritto alla conferenza
                    db.query(`call controllaiscrizione('${decoded.username}','${req.params.anno}','${req.params.acronimo}')`,(err,result)=>{
                        if(err) throw err;   
                        console.log("sono qui:"+result[0]);     
                        if(result.length!=0){
                            segui=false;
                            //
                        }  
                        var risultati=[];
                        var i=0;
                        const today= new Date();
                        const giorno= DateTime.fromJSDate(today).toLocaleString(DateTime.DATE_MED);
                        const orario= today.toLocaleTimeString();//prendo l'ora attuale

                        results[0].forEach((sessione)=>{
                            if(sessione.data==giorno){
                                if(sessione.orai<orario && orario<sessione.oraf){
                                    risultati[i]=true;
                                }
                                else{
                                    risultati[i]=false;
                                }
                            }else{
                                risultati[i]=false;
                            }
                            i++;
                        });
                        console.log("num",results[3][0]);
                    
                        //Renderizzo tutto
                        res.render('conferenza',{conferenze: results[0], giorni: results[2], moderatori: results[1], permessi: modifica, sponsors: results[4], numIscritti: results[3][0].numIscritti, segui: segui, ris: risultati});
    
                    });
                } else {
                    console.log("conferneza vuota");
                    res.render('conferenzaVuota',{nome: req.params.acronimo, anno:req.params.anno, admin: modifica});
                }
            })
        }
    });
}