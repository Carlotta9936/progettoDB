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
            listaautori.forEach((autore) => {
                console.log({ autore });
                //query che crea crea nuova istanza scritto
                db.query(`call insertscritto ('${autore}', '${req.params.id_articolo}')`,(err,results)=>{  
                    if(err){
                        console.log(err);
                    }else{
                        console.log('ok');
                    }
                });
            });
        }else{//caso in cui sia solo uno l'autore
            db.query(`call insertscritto ('${listaautori}', '${req.params.id_articolo}')`,(err,results)=>{  
                if(err){
                    console.log(err);
                }else{
                    console.log('ok');
                    
                }
            });
        }
        //query per prendere il titolo dell'articolo
        db.query(`call titoloarticolo ('${req.params.id_articolo}')`,(err, result)=>{
            if(err){throw err;}
            //serie di query per prendere i dati per assegnaAutori
            db.query(`call visualizzaautori ()`,(err,resultati)=>{
                if(err){throw err;}
                //console.log(req.params.id_articolo);
                //query per prendere autori che siano anche presenter
                db.query(`call visualizzaautoripresenter ()`,(err,results)=>{
                    if(err) {throw err;}
                    res.render('assegnaAutori',{titolo: result[0], autori: resultati[0], articolo: req.params.id_articolo, presenter: results[0], errore: false, msg: "Autori assegnati"});
                });
            });
        });
    }else{
        console.log("ok");
        //query per prendere il titolo dell'articolo
        db.query(`call titoloarticolo ('${req.params.id_articolo}')`,(err, result)=>{
            if(err){throw err;}
            //serie di query per prendere i dati per assegnaAutori
            db.query(`call visualizzaautori ()`,(err,resultati)=>{
                if(err){throw err;}
                //console.log(req.params.id_articolo);
                //query per prendere autori che siano anche presenter
                db.query(`call visualizzaautoripresenter ()`,(err,results)=>{
                    if(err) {throw err;}
                    res.render('assegnaAutori',{titolo: result[0], autori: resultati[0], articolo: req.params.id_articolo, presenter: results[0], errore: false, msg: "Seleziona degli autori"});

                });
            });
        });
    }
}
    