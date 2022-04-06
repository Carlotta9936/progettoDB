const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../connectionDB');


exports.formAutore = (req,res)=>{
    res.render('newautore');
}

exports.creaAutore = (req,res)=>{
    console.log(req.body);
    const{nome, cognome}= req.body;

    db.query(`INSERT INTO autore(nome, cognome) VALUES ('${nome}', '${cognome}');`,(err, results)=>{
        if(err){
            console.log(err);
        }else{
            let sql=(`select max(id_autore) as autore from autore `);
            db.query(sql,(err,result)=>{
                if(err){
                    console.log(err);
                }else{
                    console.log('ok');
                    db.query(`INSERT INTO scritto(autore, articolo) VALUES ('${results}', '${req.params.id_articolo}');`,(err,results)=>{
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
    console.log(listaautori);
    //console.log(req);
}
    