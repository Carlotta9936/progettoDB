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

exports.paginaSponsor=(req,res)=>{
    //query per visualizzare i dati dello sponsor
    db.query(`call selectsponsor ('${req.params.nome}')`,(err,results)=>{
        if(err) {throw err};
        res.render('sponsor',{ sponsor: results[0][0].nome, logo: results[0][0].logo})
    });
}