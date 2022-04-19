const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../connectionDB');

exports.formSessione = (req, res)=>{
    db.query('call getProgrammaGiornaliero();', function(err,result,fields){
        if(err) throw err;
        else 
        //console.log(result);
        res.render('newsessione', {programmi: result[0]});
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
        if (results[0].length==0){
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
                    if(result.length==0){
                        tipo='articolo';
                    }else{
                        tipo='tutorial';
                    }
                    console.log("siamo noi" + results[0][0]);
                    var permessi= false; //variabile per gestire i peremessi di entrata alla chat
                    var decoded = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
                    //query per verificare se sono iscritto alla conferenza di cui fa parte la sessione
                    db.query(`call verificaorasessione('${req.params.id_sessione}')`,(err,result)=>{ //da finire
                        if(err) throw err;
                        var data = new Date();
                        var gg, mm, aaaa;
                        gg = data.getDate() + "/";
                        mm = data.getMonth() + 1 + "/";
                        aaaa = data.getFullYear();
                        data= gg+'/'+mm+'/'+aaaa;
                        if(result[0].data==data){
                            permessi=true;
                            console.log('ciao'+data);
                        }
                        console.log(data);

                        res.render('sessione',{presentazioni: results[0], sessione: req.params.id_sessione, tipo: tipo, permessi: permessi});
                    });
                    
                });
            });
        }
    });
}