const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../connectionDB');
var err=false;


exports.formSponsor = (req,res)=>{
    res.render('newsponsor',{acronimo: req.params.acronimo,anno: req.params.anno, errore: err, msg: ""});
}

exports.creaSponsor = (req,res)=>{
    const{nome}= req.body;   
    console.log(req.files); 
    if(req.files.length === undefined){
        var logo = "sponsorDefault.png";
    } else {
        var logo = req.files.image[0].filename;
    }
    //query per creare nuovi sponsor
    db.query(`call insertsponsor ('${nome}', '${logo}')`,(err,results)=>{ 
        if(err){
            if (err.code === 'ER_DUP_ENTRY'){   
                console.log("we");
                err=true;
                res.render('newsponsor',{acronimo: req.params.acronimo,anno: req.params.anno, errore: err, msg: "sponsor già esistente"});
            }else{ throw err; }
            
        }else{
        res.render('newsponsor',{acronimo: req.params.acronimo,anno: req.params.anno, errore: false, msg: "nuovo sponsor creato"});
        }//Alert che ti dice "sponsor creato"
    });
}
