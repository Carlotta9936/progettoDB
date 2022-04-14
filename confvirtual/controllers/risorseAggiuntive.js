const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../connectionDB');

exports.formRisorse=(req,res)=>{
    res.render('newrisorsa',{tutorial: req.params.id_tutorial});
    //devo passare anche il cooki per sapere chi sta creando la risorsa
}

/*exports.creaRisorsa=(req,res)=>{
    const{link,descrizione}=req.body;
    //query per creare una nuova risorsa
    db.query(`call insertrisorsa('${link}','${descrizione}')`,(err,results)=>{
        if(err) {throw err}; //manca il parametro dello speaker 
    });
}*/
