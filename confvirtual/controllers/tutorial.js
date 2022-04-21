const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../connectionDB');
const jwt= require("jsonwebtoken");

exports.specificaTutorial=(req,res)=>{
    console.log(req.params);
    
    db.query(`call selecttutorial ('${req.params.id_tutorial}'); call puoVotare ('${req.params.id_tutorial}');`,(err,results)=>{
        if(err){ throw err; }
        var decoded = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
        console.log(results[2][0]);
        var voto = false;
        for(var i=0; i<results[2].length; i++){
            if(results[2][i] === decoded.username){
                
                voto=true;
            }
        }
        res.render('specificatutorial',{tutorial: results[0], vota: voto});
        
    });
}