const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../connectionDB');
const jwt = require('jsonwebtoken');


exports.specificaTutorial=(req,res)=>{
    var decoded = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
    //query per selezionare il tutorial creato
    db.query(`call selecttutorial ('${req.params.id_tutorial}'); 
                call puoVotare ('${req.params.id_tutorial}');
                call isPreferita ('${decoded.username}','${req.params.id_tutorial}'); `,(err,results)=>{
        if(err){ throw err; }
        var voto = false;
        var segui=false;
        //Controllo se sono lo speaker del articolo
        if(results[0][0].speaker === decoded.username){
            console.log(results[0].speaker);
            res.render('specificatutorial',{tutorials: results[0], seguito: segui, presentazione: req.params.id_tutorial, vota: false, speaker: true, username: decoded.username});
        } else {    //Controllo se è un associato e che debba ancora votare
            results[2].forEach(associato => {
                if(associato.admins === decoded.username){
                    voto = true;
                    //console.log(associato.admins, " - ", decoded.username)
                }
            })
        }

        if(results[4].length!=0){
            segui= true;
        }
        
        res.render('specificatutorial', {tutorials: results[0], seguito: segui, presentazione: req.params.id_tutorial, vota: voto, speaker: false, username: decoded.username});
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
        res.redirect('tutorial/' + req.params.id_tutorial);
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