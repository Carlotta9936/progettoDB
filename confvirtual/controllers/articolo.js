const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../connectionDB');
const jwt = require('jsonwebtoken');
const { DateTime } = require('luxon');

exports.specificaArticolo=(req,res)=>{
    var segui=false;
    var permessiAdmin= false;
    var permessiOrario = false;
    var presenter = false;
    var decoded = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
    //query per controllare in quale conferenza si trova la presentazione
    db.query(`call presentazioneInConferenza ('${req.params.id_articolo}')`,(err,result)=>{
        if(err){ throw err;}
        var anno=result[0][0].anno;
        //console.log(anno);
        var acronimo= result[0][0].acronimo;
        //console.log(acronimo);
        db.query(`call selectarticolo ('${req.params.id_articolo}');                                #per prendere informazioni degli autori
                    call controllaiscrizione ('${decoded.username}','${anno}','${acronimo}');       #controllo se sono iscritto
                    call isPreferita ('${decoded.username}','${req.params.id_articolo}');
                    call getAssociati ('${anno}','${acronimo}');
                    call puoVotare ('${req.params.id_articolo}');
                    call finepresentazione ('${req.params.id_articolo}');`,(err,results)=>{
                        if(err) {throw err;};
                        //Info dell'articolo
                        //Autori
                        console.log("0", results[0]);
                        //Mi piace
                        if(results[2].length!=0 && result[4]==0){   //Se sono iscritto alla conferenza e non ho messo già mi piace
                            segui = true;
                        }
                        

                        //C'è già un presenter
                        console.log(results[0][0]);
                        if(results[0][0].presenter != null){
                            presenter = true;
                        }
                        console.log("Presenter", presenter)

                        //se la presentazione è finita 
                        console.log(results[10][0].data);
                        const giornoPulito = DateTime.fromJSDate(results[10][0].data).toLocaleString(DateTime.DATE_MED);
                        const today= new Date();
                        const giorno= DateTime.fromJSDate(today).toLocaleString(DateTime.DATE_MED);
                        const orario= today.toLocaleTimeString();//prendo l'ora attuale
                        console.log(giornoPulito);
                        console.log(giorno);
                        console.log(orario);
                        console.log(results[10][0].data==giorno);
                        if(giornoPulito==giorno){
                            if(results[10][0].oraf<orario){
                                permessiOrario = true;
                            }
                            else{
                                permessiOrario = false;
                            }
                        }else if(results[10][0].oraf<giorno){
                            permessiOrario = false;
                        }else{
                            permessiOrario = true;
                        }
                        //Voto
                        console.log(results[8])
                        results[8].forEach(admin => {
                            if(decoded.username === admin.admins){
                                permessiAdmin = true;
                            }
                        }
                        );
                        
                        console.log(permessiAdmin, permessiOrario, presenter);
                        
                        res.render('specificaarticolo',{articoli: results[0], seguito: segui, presentazione: req.params.id_articolo, username: decoded.username, admin: permessiAdmin, orario: permessiOrario, add: presenter, msg:""});
                    });
    });
};

    
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
        console.log(result[0]);
        //query
        res.render('addPresenter',{presenters: result[0], msg:"", art: articolo});
    });
}

exports.addPresenter=(req,res)=>{
    const {presenters}= req.body;
    console.log("user"+presenters);
    var articolo=req.params.id_articolo
    var decoded = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);

    //query per aggiungere un presenter ad un articolo
    db.query(`call addPresenter ('${presenters}','${articolo}')`,(err,result)=>{
        if(err){ throw err;}
        //query per prendere i dati dell'articolo
        db.query(`call selectarticolo ('${req.params.id_articolo}') `,(err,results)=>{
            if(err){ throw err;}
            console.log("sono qui");
            res.redirect("/articolo/"+req.params.id_articolo);
        });
    });
}

exports.vota = (req, res) => {
    const decoded = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
    const {voto} = req.body;
    db.query(`call vota('${decoded.username}', '${req.params.id_articolo}', '${voto}');`, (err, result) => {
        if(err) {throw err;}
        res.redirect('/articolo/' + req.params.id_articolo);
    })
}