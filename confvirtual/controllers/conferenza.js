const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../connectionDB');
const jwt = require('jsonwebtoken');
const controlloDate = require('../modules/controlloDate');
const { DateTime } = require('luxon');

exports.formConferenza = (req, res)=>{
    var decoded = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
    if(decoded.diritti === "Admin"){    //Controllo ruolo dell'utente
        res.render('newconferenza');
    } else {
        res.send("Mi dispiace, per creare una conferenza bisogna essere un amministratore");
    }
}
//creo una nuova conferenza
exports.creaConferenza = (req,res,next)=>{
    var decoded = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
    const {acronimo, anno, dataInizio, dataFine, nome} = req.body;
    //Se non carica l'immagine mette l'immagine di default
    if(req.files.length === null){
        var logo = req.files.logo[0].filename;
    } else {
        var logo = "logoConferenzaDefault.png";
    }
    if(controlloDate.controlloDate(dataInizio, dataFine)){    //Controllo sulle date
        db.query(`call insertconferenza('${acronimo}','${anno}', '${logo}', '${dataInizio}','${dataFine}','${nome}','${decoded.username}');`,(err,results)=>{
            if(err) {throw err};
            //query per iscrivere l'admin alla conferenza creata
            db.query(`call addadminconferenza ('${decoded.username}','${anno}','${acronimo}')`,(err,result)=>{
                if(err) {throw err};
            });
            //reindirizzamento a creare sessioni
            next();
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
            res.render('newsessione', {programmi: results[0]});
        }
    });
}

//creo le sessioni
exports.creaSessione = (req,res)=>{
    console.log(req.body);
    const {oraI, oraF, titolo, link} = req.body;
    //query per inserire una nuova sessione
    db.query(`call insertsessione ('${oraF}','${oraI}','${titolo}','${link}','${req.params.programma}');`,(err, results)=>{
        if(err){
            //console.log(err);
        }
    })
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
            db.query(`call datiConferenza('${req.params.anno}', '${req.params.acronimo}')`, (err, results) => {
                if(err) {throw err;}
                //console.log({results});
                //verifica che la conferenza abbia un programma da visualizzare
                if (results[0].length>0){
                    results[0][0].datainizio = DateTime.fromJSDate(results[0][0].datainizio).toLocaleString(DateTime.DATE_MED);
                    results[0][0].datafine = DateTime.fromJSDate(results[0][0].datafine).toLocaleString(DateTime.DATE_MED);
                    for(var i = 0; i < results[0].length; i++){
                        results[0][i].data = DateTime.fromJSDate(results[0][i].data).toLocaleString(DateTime.DATE_MED);
                    }
                    console.log(results[0]);
                    console.log(results[1]);
                    console.log(results[2]);
                    console.log(results[3]);
                    console.log(results[4]);

                    //Controllo se l'utente ha il diritto di modificare
                    var decoded = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
                    var modifica = false;
                    
                    for(var i = 0; i < results[1].length; i++){
                        console.log(decoded.username + "  " + results[1][i].associazione_username)
                        if(results[1][i].associazione_username === decoded.username) { 
                            modifica = true;
                        }
                    }
                    
                    //Pulisco le date del programma giornaliero
                    for(var i = 0; i<results[2].length; i++){
                        results[2][i].data = DateTime.fromJSDate(results[2][i].data).toLocaleString(DateTime.DATE_MED);
                    }
                    console.log(results[2]);
                    //controllo se l'utente è già iscritto alla conferenza
                    db.query(`call controllaiscrizione('${decoded.username}','${req.params.anno}','${req.params.acronimo}')`,(err,result)=>{
                        if(err) throw err;           
                        if(result.length!=0){
                            segui=false;
                        }     
                        //Renderizzo tutto
                        res.render('conferenza',{conferenze: results[0], giorni: results[2], moderatori: results[1], permessi: modifica, sponsors: results[4], numIscritti: results[3][0].numIscritti, segui: segui});
    
                    });
                   
    
                } else {
                    console.log("conferneza vuota");
                    res.render('conferenzaVuota',{nome: req.params.acronimo, anno:req.params.anno, admin: true});
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
        res.redirect("/conferenza/"+req.params.acronimo+"/"+req.params.anno);
        }
    });
}

exports.modificaConferenza = (req, res) => {
    db.query(`call getAdminLiberi('${req.params.anno}', '${req.params.acronimo}')`, (err, results) => {
        console.log(results[0]);
        res.render("modificaConferenza", {admins: results[0], anno: req.params.anno});
    })
} 

exports.aggiungiAdmin = (req, res) => {
    const {admin} = req.body;
    db.query(`call aggiungiAssociazioni('${admin}', '${req.params.anno}', '${req.params.acronimo}');`, (err, results) => {
        if(err) {throw err;}
        res.status(200);
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
                //console.log({results});
                //verifica che la conferenza abbia un programma da visualizzare
                if (results[0].length>0){
                    results[0][0].datainizio = DateTime.fromJSDate(results[0][0].datainizio).toLocaleString(DateTime.DATE_MED);
                    results[0][0].datafine = DateTime.fromJSDate(results[0][0].datafine).toLocaleString(DateTime.DATE_MED);
                    for(var i = 0; i < results[0].length; i++){
                        results[0][i].data = DateTime.fromJSDate(results[0][i].data).toLocaleString(DateTime.DATE_MED);
                    }
                    /*console.log(results[0]);
                    console.log(results[1]);
                    console.log(results[2]);
                    console.log(results[3]);
                    console.log(results[4]);*/

                    //Controllo se l'utente ha il diritto di modificare
                    var decoded = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);                    
                    for(var i = 0; i < results[1].length; i++){
                        console.log(decoded.username + "  " + results[1][i].associazione_username)
                        if(results[1][i].associazione_username === decoded.username) { 
                            modifica=true;
                        }
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
                        if(result.length!=0){
                            segui=false;
                        }   
                        //Pulisco le date del programma giornaliero
                        for(var i = 0; i<results[2].length; i++){
                            results[2][i].data = DateTime.fromJSDate(results[2][i].data).toLocaleString(DateTime.DATE_MED);
                        }
                        console.log(results[2]);
                        //Renderizzo tutto
                        res.render('conferenza',{conferenze: results[0], giorni: results[2], moderatori: results[1], permessi: modifica, sponsors: results[4], numIscritti: results[3][0].numIscritti, segui: segui});      
                    });
                } else {
                    console.log("conferneza vuota");
                    res.render('conferenzaVuota',{nome: req.params.acronimo, anno:req.params.anno, admin: modifica});
                }
            })
        }
    });
}