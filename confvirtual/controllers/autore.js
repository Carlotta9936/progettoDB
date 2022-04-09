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
            //query per prendere id autore appena creato
            db.query(`call autorecreato ()`,(err,results)=>{
                if(err){
                    console.log(err);
                }else{
                    let autore=results[0][0].autore;
                    //query per insesrire nella tabella scritto gli autori associati agli articoli
                    db.query(`call insertscritto ('${autore}', '${req.params.id_articolo}')`,(err,result)=>{
                        if(err){
                            console.log(err);
                        }else{
                            console.log('ok');
                        }
                    });
                }
            });
            
        }
    })
}

exports.assegnaAutore=(req,res)=>{
    const {listaautori}=req.body;
    console.log(listaautori);
    if(listaautori!==undefined){
        if(Array.isArray(listaautori)){
            console.log("totta ti amo");
            //se clicclo su assegna senza aver segnato gli auotori o uno solo va in errore
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
        }else{
            db.query(`call insertscritto ('${listaautori}', '${req.params.id_articolo}')`,(err,results)=>{  
                if(err){
                    console.log(err);
                }else{
                    console.log('ok');
                }
            });
        }
    }else{
        console.log("ok");
        res.render("errorautori");
    }
}
    