const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../connectionDB');


exports.formAutore = (req,res)=>{
    res.render('newautore');
}

exports.creaAutore = (req,res)=>{
    console.log(req.body);
    const{nome, cognome}= req.body;
    //fatto
    //db.query(`INSERT INTO autore(nome, cognome) VALUES ('${nome}', '${cognome}');`,(err, results)=>{
    db.query(`call insertautore ('${nome}', '${cognome}')`,(err,results)=>{
        if(err){
            console.log(err);
        }else{
            //fatto
            /*let sql=(`select max(id_autore) as autore from autore `);
            db.query(sql,(err,result)=>{*/
            db.query(`call autorecreato ()`,(err,results)=>{
                if(err){
                    console.log(err);
                }else{
                    console.log('ok');
                    //fatto
                    //db.query(`INSERT INTO scritto(autore, articolo) VALUES ('${results}', '${req.params.id_articolo}');`,(err,results)=>{
                    db.query(`call insertscritto ('${results[0].autore}', '${req.params.id_articolo}');`,(err,results)=>{
                        if(err){
                            console.log(err);
                        }else{
                            console.log('ok');
                        }
                    });
                }
            });
            
        }
    })
}


//UPDATE `confvirtual`.`autore` SET `nome` = 'gabiel', `cognome` = 'alsina' WHERE (`id_autore` = '1');
//let ddl=`update scritto set  autore='${aut[i]}', articolo='${res.params.articolo}'`
exports.assegnaAutore=(req,res)=>{
    const {listaautori}=req.body;
    listaautori.forEach((autore) => {
        console.log({ autore });
        //fatto
        //db.query(`INSERT INTO scritto(autore, articolo) VALUES ('${autore}', '${req.params.id_articolo}');`,(err,results)=>{
        db.query(`call insertscritto ('${autore}', '${req.params.id_articolo}')`,(err,results)=>{  
            if(err){
                console.log(err);
            }else{
                console.log('ok');
            }
        });
      });
    
    //console.log(req);
}
    