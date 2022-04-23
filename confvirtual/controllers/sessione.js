const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../connectionDB');
errore= false;

exports.formSessione = (req, res)=>{
    db.query('call getProgrammaGiornaliero();', function(err,result,fields){
        if(err) throw err;
        else {
        //console.log(result);
        res.render('newsessione', {programmi: result[0], error: false, msg:""});
        }
    });
}

exports.creaSessione = (req,res)=>{
    console.log(req.body);
    const {oraI, oraF, titolo, link, num, programma} = req.body;
    
    db.query(`call creaSessione ('${oraF}','${oraI}','${titolo}','${link}','${num}','${programma}');`,(err, results)=>{
        if(err){
            console.log(err);
        }else{
            console.log('ok');
        }
    })
}

exports.specificaSessione=(req,res)=>{
    //query che controlla la sessione abbia già delle presentazioni
    db.query(`call visualizzapresentazione ("${req.params.id_sessione}")`, function(err,results){
        if(err) throw err;
        if (results[0][0]==undefined){
            console.log(req.params.titolo);
            res.render('sessioneVuota',{titolo: req.params.titolo});
        }else{
            db.query(`call articoloSessionePresentazione("${req.params.id_sessione}")`, function(err,results){
                if(err) throw err;
                console.log(results[0]);
                //controllo tipologia della presentazione
                db.query(`call istutorial('${req.params.id_sessione}')`,(err,result)=>{
                    if(err) throw err;
                    var tipo='';
                    console.log(result[0]);
                    if(result[0].length==0){
                        //controllo tipologia della presentazione
                        db.query(`call isarticolo('${req.params.id_sessione}')`,(err,result)=>{
                            if(err) throw err;
                            if(result[0].length!=0){
                                tipo='articolo';
                            }else{
                                res.render('sessioneVuota',{titolo: req.params.titolo});

                            }
                        });
                    }else{
                        tipo='tutorial';
                    }
                    console.log("siamo noi" + results[0][0]);
                    
                    res.render('sessione',{presentazioni: results[0], sessione: req.params.id_sessione, tipo: tipo});
                });
            });
        }
    });
}