const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../connectionDB');
const jwt = require('jsonwebtoken');


exports.specificaTutorial=(req,res)=>{
    var decoded = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
    console.log(req.params);
    //query per selezionare il tutorial creato
    db.query(`call selecttutorial ('${req.params.id_tutorial}'); call puoVotare ('${req.params.id_tutorial}');`,(err,results)=>{
        if(err){ throw err; }
        console.log(results[0]);
        var decoded = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
        console.log(results[2][0]);
        var voto = false;
        for(var i=0; i<results[2].length; i++){
            if(results[2][i] === decoded.username){
                voto=true;
            }
        }
        
        //query per controllare in quale conferenza si trova la presentazione
        db.query(`call presentazioneInConferenza ('${req.params.id_tutorial}')`,(err,result)=>{
            if(err){ throw err;}
            var anno=result[0][0].anno;
            console.log(anno);
            var acronimo= result[0][0].acronimo;
            console.log(acronimo);
            //query per verificare se l'utente è iscritto alla conferenza
            db.query(`call controllaiscrizione ('${decoded.username}','${anno}','${acronimo}')`,(err,result)=>{
                if(err){ throw err;}
                var segui=false;
                console.log(result);
                if(result[0].length!=0){
                    console.log("ciao");
                    //query per controllare se sia già tra i preferiti
                    db.query(`call isPreferita ('${decoded.username}','${req.params.id_tutorial}')`,(err,ris)=>{
                        if(err){ throw err;}                        
                        console.log(segui);

                        console.log(ris);
                        if(ris[0].length==0){
                            segui= true;
                        }
                        console.log(segui);
                        res.render('specificatutorial',{tutorials: results[0], seguito: segui, presentazione: req.params.id_tutorial, vota: true, username: decoded.username});
                    });
                } else {
                 res.render('specificatutorial',{tutorials: results[0], seguito: segui, presentazione: req.params.id_tutorial, username: decoded.username});
                }
            });
        });
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