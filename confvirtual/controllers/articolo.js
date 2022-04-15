const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../connectionDB');

exports.specificaArticolo=(req,res)=>{
    db.query(`call selectarticolo ('${req.params.id_articolo}') `,(err,results)=>{
        if(err){
            console.log(err);
        }else{
        res.render('specificaarticolo',{articolo: results[0]});
        }
    });
}