const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../connectionDB');


exports.formSponsor = (req,res)=>{
    res.render('newsponsor');
}

exports.creaSponsor = (req,res)=>{
    console.log(req.body);
    const{nome, logo}= req.body;

    //db.query(`INSERT INTO sponsor(nome, logo) VALUES ('${nome}', '${logo}');`,(err, results)=>{
    db.query(`call insertsponsor ('${nome}', '${logo}')`,(err,results)=>{ 
        if(err){
            console.log(err);
        }else{
            console.log('ok');
        }
    })
}