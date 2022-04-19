const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../connectionDB');


exports.formSponsor = (req,res)=>{
    res.render('newsponsor',{acronimo: req.params.acronimo,anno: req.params.anno});
}

exports.creaSponsor = (req,res)=>{
    const{nome}= req.body;    
    console.log(req.files.image[0].filename);
   
    if(req.files.length !== 0){
        var logo = req.files.logo[0].filename;
    } else {
        var logo = "sponsorDefault.png";
    }
    //query per creare nuovi sponsor
    db.query(`call insertsponsor ('${nome}', '${logo}')`,(err,results)=>{ 
        if(err){throw err;
        }else{
            console.log('ok');
            res.status(200);
        }
    });
}
