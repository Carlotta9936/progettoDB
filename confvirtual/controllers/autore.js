const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../connectionDB');
var errore=false;


exports.formAutore = (req,res)=>{
    res.render('newautore',{msg: "", articolo: ""});
}

exports.creaAutore = (req,res)=>{
    console.log(req.body);
    const{nome, cognome}= req.body;
    //query di inserimento autore creato
    db.query(`call insertautore ('${nome}', '${cognome}')`,(err,results)=>{
        if(err){throw err;}
        //query per prendere id autore appena creato
        db.query(`call autorecreato ()`,(err,results)=>{
            if(err){throw err;}
            let autore=results[0][0].autore;
            //query per insesrire nella tabella scritto gli autori associati agli articoli
            db.query(`call insertscritto ('${autore}', '${req.params.id_articolo}')`,(err,result)=>{
                if(err){throw err};
                res.render('newautore',{msg: "autore creato e assegnato all'articolo: " ,articolo: req.params.id_articolo})
            });
        });
    })
}

exports.assegnaAutore=(req,res)=>{
    const {listaautori}=req.body;
    //const idArticolo = req.params;
    console.log(listaautori);

    if(listaautori.length === 1){
        db.query(`call insertscritto ('${listaautori}', '${req.params.id_articolo}')`,(err,result)=>{
            if(err) {throw err;}
            console.log("OK");
        });
    } else {
        listaautori.forEach(autore => {
            db.query(`call insertscritto ('${autore}', '${req.params.id_articolo}')`,(err,result)=>{
                if(err) {throw err;}
                console.log("OK");
            });
        })
    } 

    db.query(`call titoloarticolo ('${req.params.id_articolo}')`,(err, result)=>{
        if(err){throw err;}
        //serie di query per prendere i dati per assegnaAutori
        db.query(`call visualizzaautori ('${req.params.id_articolo}')`,(err,resultati)=>{
            if(err){throw err;}
            //console.log(req.params.id_articolo);
            //query per prendere autori che siano anche presenter
            db.query(`call visualizzaautoripresenter ()`,(err,results)=>{
                if(err) {throw err;}
                if(errore==false){
                    res.render('assegnaAutori',{titolo: result[0][0].titolo, autori: resultati[0], articolo: req.params.id_articolo, presenter: results[0], errore: false, msg: "Autori assegnati"});
                }
                else{
                    res.render('assegnaAutori',{titolo: result[0][0].titolo, autori: resultati[0], articolo: req.params.id_articolo, presenter: results[0], errore: true, msg: "Selezionare almeno un autore che sia presentatore"});

                }
            });
        });
    });
     
}

exports.assegnaAutorePresenter=(req,res)=>{
    const {listaautori}=req.body;
    //const idArticolo = req.params;
    console.log(listaautori);

    if(listaautori.length === 1){
        db.query(`call insertscritto ('${listaautori}', '${req.params.id_articolo}')`,(err,result)=>{
            if(err) { errore=true; }
            console.log("OK");
        });
    } else {
        listaautori.forEach(autore => {
            db.query(`call insertscritto ('${autore}', '${req.params.id_articolo}')`,(err,result)=>{
                if(err) { errore=true; }
                console.log("OK");
            });
        })
    } 

    db.query(`call titoloarticolo ('${req.params.id_articolo}')`,(err, result)=>{
        if(err){throw err;}
        //serie di query per prendere i dati per assegnaAutori
        db.query(`call visualizzaautori ('${req.params.id_articolo}')`,(err,resultati)=>{
            if(err){throw err;}
            //console.log(req.params.id_articolo);
            //query per prendere autori che siano anche presenter
            db.query(`call visualizzaautoripresenter ()`,(err,results)=>{
                if(err) {throw err;}
                if(errore==false){
                    res.render('assegnaAutori',{titolo: result[0][0].titolo, autori: resultati[0], articolo: req.params.id_articolo, presenter: results[0], errore: false, msg: "Autori assegnati", giafatto: true});
                }
                else{
                    res.render('assegnaAutori',{titolo: result[0][0].titolo, autori: resultati[0], articolo: req.params.id_articolo, presenter: results[0], errore: true, msg: "Selezionare almeno un autore che sia presentatore", giafatto: false});

                }
            });
        });
    }); 
}