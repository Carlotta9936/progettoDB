const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../connectionDB');
const jwt = require('jsonwebtoken');
const { DateTime } = require('luxon');



exports.specificaTutorial=(req,res)=>{
    var decoded = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
    //query per selezionare il tutorial creato
    db.query(`call selecttutorial ('${req.params.id_tutorial}'); 
                call puoVotare ('${req.params.id_tutorial}');
                call isPreferita ('${decoded.username}','${req.params.id_tutorial}'); 
                call getRisorseAggiuntive ('${req.params.id_tutorial}');
                call finepresentazione ('${req.params.id_tutorial}')`,(err,results)=>{
        if(err){ throw err; }
        console.log(results[6]);
        var permessiAdmin = false;
        var segui=false;
        var permessiOrario = false;
        var speaker=false;
        //Controllo se sono lo speaker del articolo
        if(results[0][0].speaker === decoded.username){
            console.log(results[0].speaker);
            speaker=true;
        } 
        const giornoPulito = DateTime.fromJSDate(results[8][0].data).toLocaleString(DateTime.DATE_MED);
        const today= new Date();
        const giorno= DateTime.fromJSDate(today).toLocaleString(DateTime.DATE_MED);
        const orario= today.toLocaleTimeString();//prendo l'ora attuale
        console.log(results[8]);
        console.log(giornoPulito, giorno, giornoPulito==giorno);
        console.log(results[8][0].oraf, orario, results[8][0].oraf<orario)
        if(giornoPulito==giorno){
            if(results[8][0].oraf<orario){
                permessiOrario = true;
            }
            else{
                permessiOrario = false;
            }
        }else if(giornoPulito<giorno){
            permessiOrario = false;
        }else{
            permessiOrario = true;
        }

        //Controllo se è un associato e che debba ancora votare
        results[2].forEach(associato => {
            if(associato.admins === decoded.username){
                permessiAdmin = true;
                //console.log(associato.admins, " - ", decoded.username)
            }
        })
        
        console.log(permessiOrario, "-", permessiAdmin)
        console.log(results[4], results[4].length===0)
        if(results[4].length===0){
            segui= true;
        }
        
        res.render('specificatutorial', {tutorials: results[0], seguito: segui, presentazione: req.params.id_tutorial, risorse: results[6], admin: permessiAdmin, orario: permessiOrario, speaker: speaker, username: decoded.username});
    });
}

exports.mipiace=(req,res)=>{
    //query per inserire la presentazione nella lista dei preferiti
    db.query(`call insertPreferiti ('${req.params.id_tutorial}','${req.params.username}')`,(err,result)=>{
        if(err){ throw err;}
        res.redirect('/tutorial/'+req.params.id_tutorial);
    });
}

exports.vota = (req, res) => {
    const decoded = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
    const {voto} = req.body;
    db.query(`call vota('${decoded.username}', '${req.params.id_tutorial}', '${voto}');`, (err, result) => {
        if(err) {throw err;}
        res.redirect('/tutorial/' + req.params.id_tutorial);
    })
}

exports.risorsaAggiuntiva = (req, res) => {
    const decoded = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
    const tutorial = req.params.id_tutorial
    const {descrizione} = req.body;
    const PDF = req.files.risAgg;
    db.query(`call nuovaRisorsaAggiuntiva('${PDF[0].filename}','${descrizione}','${decoded.username}', '${tutorial}')`, (err, result) => {
        if(err) {throw err;}
        console.log("Aggiunta");
        res.redirect(`../../tutorial/${tutorial}`);

    })
}

exports.modificaRisorsaAggiuntiva = (req, res) => {
    console.log("WE", req.modificaRisorsa);
    res.render('modificaRisorsaAggiuntiva', {msg:"", idTutorial: req.params.id_tutorial });
}

exports.uploadRisorsaAggiuntiva = (req, res) => {
    const id = req.params.idRisorsa;
    const {descrizione} = req.body;
    const risorsa = req.files.risAgg;
    db.query(`call uploadRisorsaAggiuntiva('${id}', '${risorsa[0].filename}','${descrizione}')`, (err, results) => {
        if(err) {throw err;}
        console.log(req.params.id_tutorial);
        res.render('modificaRisorsaAggiuntiva', {msg: "Risorsa aggiuntiva aggiornata corretamente", idTutorial: req.params.id_tutorial })
    })
}