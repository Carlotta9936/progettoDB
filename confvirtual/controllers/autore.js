const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../connectionDB');


exports.formAutore = (req,res)=>{
    res.render('newautore');
}

exports.creaAutore = (req,res)=>{
    console.log(req.body);
    const{nome, cognome}= req.body;
    //query di inserimento autore creato
    db.query(`call insertautore ('${nome}', '${cognome}')`,(err,results)=>{
        if(err){
            console.log(err);
        }else{
            //query per prendere id auotore appena creato
            db.query(`call autorecreato ()`,(err,results)=>{
                if(err){
                    console.log(err);
                }else{
                    //non va un cazzo!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    /*
                    console.log(results[0]);
                    let autore=results[0];
                    //fatto
                    //db.query(`INSERT INTO scritto(autore, articolo) VALUES ('${results}', '${req.params.id_articolo}');`,(err,results)=>{
                    db.query(`call insertscritto ('${autore}', '${req.params.id_articolo}')`,(err,result)=>{
                        if(err){
                            console.log(err);
                        }else{
                            console.log('ok');
                        }
                    });*/
                }
            });
            
        }
    })
}

exports.assegnaAutore=(req,res)=>{
    const {listaautori}=req.body;
    //se clicclo su assegna senza aver segnato gli auotori va in errore
    listaautori.forEach((autore) => {
        console.log({ autore });
        //query che crea crea nuova istanza iscritto
        db.query(`call insertscritto ('${autore}', '${req.params.id_articolo}')`,(err,results)=>{  
            if(err){
                console.log(err);
            }else{
                console.log('ok');
            }
        });
      });
    
    //console.log(req);
}
    