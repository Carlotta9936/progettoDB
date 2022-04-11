const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../connectionDB');


exports.formSponsor = (req,res)=>{
    res.render('newsponsor',{acronimo: req.params.acronimo,anno: req.params.anno});
}

exports.creaSponsor = (req,res)=>{
    console.log(req.body);
    const{nome, logo}= req.body;
    //query per creare nuovi sponsor
    db.query(`call insertsponsor ('${nome}', '${logo}')`,(err,results)=>{ 
        if(err){
            console.log(err);
        }else{
            console.log('ok');
        }
    });
}