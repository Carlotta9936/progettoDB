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
                        console.log(results[0][0].presenter);
                        if(results[0][0].presenter != null){
                            presenter = true;
                        }
                        console.log("Presenter", presenter)

                        //se la presentazione è finita 
                        console.log(results[10]);
                        const today= new Date();
                        const giorno= DateTime.fromJSDate(today).toLocaleString(DateTime.DATE_MED);
                        const orario= today.toLocaleTimeString();//prendo l'ora attuale
                        //console.log(results[10][0].data);
                        //console.log(giorno);
                        //results[10][0].data==giorno
                        if(results[10][0].data==giorno){
                            if(results[10][0].ora_f<orario){
                                permessiOrario = true;
                            }
                            else{
                                permessiOrario = false;
                            }
                        }else if(results[10][0].data<giorno){
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
                    }
                )
            }
        )
    };
    
            
    
    //Voto


                
                  /*
    db.query(`call selectarticolo ('${req.params.id_articolo}') `,(err,results)=>{
        if(err){ throw err;}
        
            //query per verificare se l'utente è iscritto alla conferenza
            db.query(`call controllaiscrizione ('${decoded.username}','${anno}','${acronimo}')`,(err,result)=>{
                if(err){ throw err;}
                console.log(result);
                if(result[0].length!=0){
                    console.log("ciao");
                    //query per controllare se sia già tra i preferiti
                    db.query(`call isPreferita ('${decoded.username}','${req.params.id_articolo}')`,(err,ris)=>{
                        if(err){ throw err;}                        
                        console.log(segui);

                        //console.log(ris);
                        if(ris[0].length==0){
                            segui= true;
                        }
                        console.log(req.params.id_articolo);
                        //query per verificare se chi visualizza è un admin associato
                        db.query(`call getAssociati ('${anno}','${acronimo}')`,(err,result)=>{
                            if(err){ throw err;}
                            console.log(result[0][0].associazione_username);
                            result[0][0].forEach((ris)=>{
                                if(ris.associazione_username==decoded.username){
                                    //controllo se ha il diritto di votare
                                    db.query(`call puoVotare ('${req.params.id_articolo}')`,(err,result)=>{
                                        if(err){ throw err;}
                                        result[0].forEach((ris)=>{
                                            console.log(ria);
                                            if(ris==decoded.username){
                                                //query per vedere se la presentazione è finita
                                                db.query(`call finepresentazione ('${req.params.id_articolo}')`,(err,result)=>{
                                                    if(err){ throw err;}
                                                    console.log("ei",result[0]);
                                                    if(result[0].lenght!=0){
                                                        const today= new Date();
                                                        const giorno= DateTime.fromJSDate(today).toLocaleString(DateTime.DATE_MED);
                                                        const orario= today.toLocaleTimeString();//prendo l'ora attuale
                                                        console.log(result[0][0].data);
                                                        if(result[0][0].data==giorno){
                                                            if(result[0][0].ora_f<orario){
                                                                permessi=true;
                                                            }
                                                            else{
                                                                permessi=false;
                                                            }
                                                        }else if(result[0].data<giorno){
                                                            permessi=true;
                                                        }else{
                                                            permessi=false;
                                                        }
                                                    }
                                                    res.render('specificaarticolo',{articoli: results[0], seguito: segui, presentazione: req.params.id_articolo, username: decoded.username,admin: permessi,add: false, msg:""});
                                                });                           
                                            }
                                        });
                                        res.render('specificaarticolo',{articoli: results[0], seguito: segui, presentazione: req.params.id_articolo, username: decoded.username,admin: permessi,add: false, msg:""});   
                                    });
                                    res.render('specificaarticolo',{articoli: results[0], seguito: segui, presentazione: req.params.id_articolo, username: decoded.username,admin: permessi, add:false , msg: ""});
                                }
                                res.render('specificaarticolo',{articoli: results[0], seguito: segui, presentazione: req.params.id_articolo, username: decoded.username,admin: permessi, add:false , msg: ""});
                            });      
                        });    
                    });
                } else {
                    res.render('specificaarticolo',{articoli: results[0], seguito: segui, presentazione: req.params.id_articolo, username: decoded.username,admin: permessi,add: false, msg:"" });       
                }
            });
        });
    });
}*/


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
        res.render('addPresenter',{presenters: result[0],msg:"", art: articolo});
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
            //query per verificare se segui la presentazione
            db.query(`call isPreferita ('${decoded.username}','${req.params.id_articolo}')`,(err,ris)=>{
                if(err){ throw err;}                        
                console.log(segui);

                console.log(ris);
                if(ris[0].length==0){
                    segui= true;
                }
                console.log(req.params.id_articolo);     
                           
            });
            res.redirect("/articolo/"+req.params.id_articolo);
            //res.render('specificaarticolo',{articoli: results[0], seguito: segui, presentazione: req.params.id_articolo, username: decoded.username,admin: true, add: true ,msg: "presenter assegnato", voti: voto});
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