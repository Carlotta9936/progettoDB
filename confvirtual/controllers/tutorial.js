const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../connectionDB');

exports.specificaTutorial=(req,res)=>{
    console.log(req.params);
    db.query(`call selecttutorial ('${req.params.id_tutorial}') `,(err,results)=>{
        if(err){ throw err; }
        console.log(results[0]);
        res.render('specificatutorial',{tutorial: results[0]});
        
    });
}