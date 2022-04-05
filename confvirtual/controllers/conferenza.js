const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../connectionDB');
const jwt = require('jsonwebtoken');

exports.formConferenza = (req, res)=>{
    res.render('newconferenza');
}
//creo una nuova conferenza
exports.creaConferenza = (req,res,next)=>{
    console.log(req.body);
    const {acronimo, anno, logo, dataInizio, dataFine, nome, creatore} = req.body;
    //da mofificare il totale sponsorizzazioni
    db.query(`INSERT INTO conferenza(acronimo, anno, logo, datainizio, datafine, totale_sponsorizzazioni, svolgimento, nome, creatore) VALUES ('${acronimo}','${anno}', '${logo}', '${dataInizio}', '${dataFine}', 1, 'attiva', '${nome}', '${creatore}');`,(err, results)=>{
        if(err){
            console.log(err);
        }else{
            //reindirizzamento a creare sessioni
            next();
        }
    })
}

//creazione automatica della tabella programma_giornaliero in base ai giorni della conferenza
exports.creaProgramma= (req,res)=>{
    let firstDate = new Date(req.body.dataInizio),
    secondDate = new Date(req.body.dataFine),
    timeDifference = Math.abs(secondDate.getTime() - firstDate.getTime());
    let differentDays = Math.ceil(timeDifference / (1000 * 3600 * 24) + 1);
    //console.log(differentDays);
    for(let i=0;i<differentDays;i++){

        let data= new Date(firstDate.getTime()+((1000 * 3600 * 24)*i)).toISOString().slice(0,19).replace('T', ' ');
        console.log(data);

        db.query(`INSERT INTO programma_giornaliero(acronimo, anno, data) VALUES ('${req.body.acronimo}','${req.body.anno}', '${data}');`,(err, results)=>{
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
    //console.log(conferenza.anno);
    db.query(`SELECT * FROM programma_giornaliero WHERE programma_giornaliero.anno="${req.params.anno}" and programma_giornaliero.acronimo="${req.params.acronimo}"`, function(err,result,fields){
        if(err) throw err;
        else 
        console.log({result});
        res.render('newsessione', {programmi: result});
    });
}
//creo le sessioni
exports.creaSessione = (req,res)=>{
    console.log(req.body);
    const {oraI, oraF, titolo, link, num} = req.body;

    db.query(`INSERT INTO sessione(ora_f, ora_i, titolo, link, num_presentazioni, programma) VALUES ('${oraF}','${oraI}','${titolo}','${link}','${num}','${req.params.programma}');`,(err, results)=>{
        if(err){
            console.log(err);
        }
    })
}



//visualizzazione specifica di una conferenza
exports.programma = (req,res)=>{
    //query di verifica esista la conferenza richiesta
    let sqlverifica=`select *
    from conferenza
    where conferenza.svolgimento='attiva' and conferenza.anno= "${req.params.anno}" and conferenza.acronimo="${req.params.acronimo}"`;
    db.query(sqlverifica,function(err,results){
        if(err) throw err;
        if (results.length==0){
            console.log(results);
            res.render('conferenzaInesistente',{nome: req.params.acronimo, anno:req.params.anno});
        }else{
            let sql = `select conferenza.nome as nome, conferenza.acronimo as acronimo, conferenza.anno as anno, conferenza.creatore as creatore, conferenza.datainizio as datainizio, conferenza.datafine as datafine, conferenza.logo as logo, programma_giornaliero.data as data, sessione.link as link, sessione.ora_i as orai, sessione.titolo as titolosessione, sessione.ora_f as oraf, programma_giornaliero.data as data, sessione.id_sessione as sessione
                from conferenza inner join programma_giornaliero on (conferenza.anno=programma_giornaliero.anno and conferenza.acronimo=programma_giornaliero.acronimo)
                inner join sessione on( programma_giornaliero.id_programma=sessione.programma)
                where conferenza.anno= "${req.params.anno}" and conferenza.acronimo="${req.params.acronimo}"`;
                db.query(sql, function(err, results){
                    if(err) throw err;
                    console.log("ciao"+results);
                    //verifica che la conferenza abbia un programma da viasualizzare
                    if (results.length>0){
                        //query per visulizzare gli sponsor
                        let sqlsponsor=`select sponsor.nome
                        from conferenza, sponsor, sponsorizzazione
                        where conferenza.svolgimento='attiva' and conferenza.anno= "${req.params.anno}"
                        and conferenza.acronimo= "${req.params.acronimo}"
                        and conferenza.anno=sponsorizzazione.annoConf 
                        and conferenza.acronimo=sponsorizzazione.acronimoConf
                        and sponsorizzazione.nome_sponsor=sponsor.nome`;
                        db.query(sqlsponsor, function(err, result){
                            if(err) throw err;
                            console.log(result);
                            res.render('conferenza',{conferenze: results, sponsors: result});

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
    let sql = `select conferenza.nome as nome, conferenza.acronimo as acronimo, conferenza.anno as anno, conferenza.datainizio as datainizio, conferenza.datafine as datafine
                from conferenza
                where conferenza.svolgimento='attiva'`;
    db.query(sql, function(err, results,next){
        if(err) throw err;
        console.log({results});

        res.render('conferenzeAttive',{conferenze: results });
    });

}
//visualizzazioni per inserire un nuova sponsorizazione ad una conferenza
exports.formSponsorizzazione=(req,res)=>{
    console.log(res);
    let sql = `select sponsor.nome as nome
                from sponsor`;
    db.query(sql, function(err, results){
        if(err) throw err;
        console.log({results});
        res.render('newsponsorizzazione', {acronimo: req.params.acronimo,anno: req.params.anno, sponsor: results});
    });
}
let conta=0;
exports.creaSponsorizzazione=(req,res)=>{
    conta++;
    //console.log(conta);
    const { importo, sponsor} = req.body;
    db.query(`INSERT INTO sponsorizzazione(importo, annoConf, acronimoConf, nome_sponsor) VALUES ('${importo}','${req.params.anno}', '${req.params.acronimo}', '${sponsor}');`,(err, results)=>{
        if(err) {throw err};
        if (conta>5){
            res.redirect('');//ancora non so dove
        }
    });
   
}

exports.segui = (req, res) => {
    var decoded = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decoded.username);
    db.query(`INSERT INTO iscrizione (iscrizione_anno, iscrizione_acronimo, iscrizione_username) VALUES ('${req.params.anno}', '${req.params.acronimo}', '${decoded.username}');`, (err, results) => {
        if(err) {throw err}
        else {
        console.log("Si cazzo");
        }
    });
}