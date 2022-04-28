const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../connectionDB');



exports.formSponsor = (req,res)=>{
    res.render('newsponsor',{acronimo: req.params.acronimo,anno: req.params.anno, errore: false, msg: ""});
}

exports.creaSponsor = (req,res)=>{
    const{nome}= req.body;  
    //Controllo che l'utente abbia inserito l'immagine, altrimenti mette un'immagine di default 
    try{
        var logo = req.files.image[0].filename;
    } catch (e) {
        var logo = "sponsorDefault.png";
    }
    //query per creare nuovi sponsor
    db.query(`call insertsponsor ('${nome}', '${logo}')`,(err,results)=>{ 
        if(err){
            if (err.code === 'ER_DUP_ENTRY'){   
                console.log("we");
                err=true;
                res.render('newsponsor',{acronimo: req.params.acronimo,anno: req.params.anno, errore: true, msg: "sponsor già esistente"});
            }else{ throw err; }
            
        }else{
        res.render('newsponsor',{acronimo: req.params.acronimo,anno: req.params.anno, errore: false, msg: "nuovo sponsor creato"});
        }//Alert che ti dice "sponsor creato"
    });
}
