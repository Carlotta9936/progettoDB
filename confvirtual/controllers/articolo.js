const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../connectionDB');
const jwt = require('jsonwebtoken');


exports.specificaArticolo=(req,res)=>{
    var permessi= false;
    var decoded = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
    db.query(`call selectarticolo ('${req.params.id_articolo}') `,(err,results)=>{
        if(err){ throw err;}
        //query per controllare in quale conferenza si trova la presentazione
        db.query(`call presentazioneInConferenza ('${req.params.id_articolo}')`,(err,result)=>{
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
                    db.query(`call isPreferita ('${decoded.username}','${req.params.id_articolo}')`,(err,ris)=>{
                        if(err){ throw err;}                        
                        console.log(segui);

                        console.log(ris);
                        if(ris[0].length==0){
                            segui= true;
                        }
                        console.log(req.params.id_articolo);
                        //query per verificare se chi visualizza è un admin associato
                        db.query(`call getAssociati ('${anno}','${acronimo}')`,(err,result)=>{
                            if(err){ throw err;}
                            console.log(result[0][0]);
                            result[0][0].forEach((ris)=>{
                                if(ris==decoded.username){
                                    permessi=true;
                                }
                            });
                            res.render('specificaarticolo',{articoli: results[0], seguito: segui, presentazione: req.params.id_articolo, username: decoded.username,admin: permessi, add:false });
                        });
                    });
                } else {
                    //query per verificare se chi visualizza è un admin associato
                    db.query(`call getAssociati ('${anno}','${acronimo}')`,(err,result)=>{
                        if(err){ throw err;}
                        result[0][0].forEach((ris)=>{
                            if(ris==decoded.username){
                                permessi=true;
                            }
                        });
                        res.render('specificaarticolo',{articoli: results[0], seguito: segui, presentazione: req.params.id_articolo, username: decoded.username,admin: permessi,add: false });
                    });          
                }
            });
        });
    });
}


exports.mipiace=(req,res)=>{
    //query per inserire la presentazione nella lista dei preferiti
    db.query(`call insertPreferiti ('${req.params.id_articolo}','${req.params.username}')`,(err,result)=>{
        if(err){ throw err;}
        res.redirect('/articolo/'+ req.params.id_articolo);
    });
}

exports.formaddPresenter=(req,res)=>{
    var articolo= req.params.id_articolo;
    //query per visualizzare i papabili presenter
    db.query(`call presenterArticolo ('${articolo}')`,(err,result)=>{
        if(err){ throw err;}
        console.log(result[0])
        res.render('addPresenter',{presenters: result[0],msg:"", art: articolo});
    });
}

exports.addPresenter=(req,res)=>{
    var user= req.body;
    var articolo=req.params.id_articolo
    //query per aggiungere un presenter ad un articolo
    db.query(`call addPresenter ('${user}','${articolo}')`,(err,result)=>{
        if(err){ throw err;}
        //query per prendere i dati dell'articolo
        db.query(`call selectarticolo ('${req.params.id_articolo}') `,(err,results)=>{
            if(err){ throw err;}
            res.render('specificaarticolo',{articoli: results[0], seguito: segui, presentazione: req.params.id_articolo, username: decoded.username,admin: true, add: true });
        });
    });
}