const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../connectionDB');

exports.specificaTutorial=(req,res)=>{
    db.query(`call selecttutorial ('${req.params.id_tutorial}') `,(err,results)=>{
        if(err){
            console.log(err);
        }else{
        res.render('specificatutorial',{tutorial: results[0]});
        }
    });
}