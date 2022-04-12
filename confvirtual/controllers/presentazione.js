const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../connectionDB');


exports.formPresentazione = (req, res)=>{
    //query per visualizzare dati di una sessione
    db.query(`call specificasessione ('${req.params.sessione}')`,(err,results)=>{
        if(err) throw err;
        //console.log(results[0]);
        res.render('newpresentazione',{sessione: results[0]});
    });
}


exports.creaPresentazione = (req,res)=>{
    console.log(req.body);
    let {oraI, oraF, ordine, tipo} = req.body;
    db.query(`call getSessione('${req.params.sessione}')`, (err, result => {
        if(err) {throw err;}
        console.log(result[0]);
        if(oraF>oraI && oraI>=result.ora_i){
            console.log("VA bene");
        }else{
            console.log("non va bene")
        }
        db.query(`call insertpresentazione('${oraI}','${oraF}','${ordine}','${req.params.sessione}');`,(err,results)=>{
        if(err){
            console.log(err);
        
            tipo=req.body.tipo;
            //query per prendere l'ultima presentazione creata
            db.query(`call selezionapresentazione ()`,(err,results)=>{
                if(err){
                    //console.log(results);
                    console.log(err);
                }else{
                    console.log(results[0]);
                    res.redirect(tipo+'/'+results[0][0].id);
                }
            });
        }
    })
    }))
    
}
//view per la creazione di articoli
exports.formArticolo=(req,res)=>{
    console.log(req.params.id_articolo);
    res.render('newarticolo',{articolo: req.params.id_articolo});
}

//creao articolo senza l'assegnazione del presenter
exports.creaArticolo=(req,res)=>{
    const {PDF, pagine, titolo}= req.body;
    console.log('we'+req.params.id_articolo);
    db.query(`call insertarticolo ('${req.params.id_articolo}','${PDF}','${pagine}','${titolo}')`,(err,results)=>{
        if(err){
            console.log(err);
        }else{
            //vado a controllare che gli autori dell'articolo esistano sul db, se non esistono devo crearli
            db.query(`call visualizzaautori ()`,(err,results)=>{
                if(err){
                    console.log(err);
                }else{
                    if(results.length==0){
                        res.render('newautore',{titolo: titolo, articolo: req.params.id_articolo})
                    }else{
                        console.log(req.params.id_articolo);
                        res.render('assegnaAutori',{titolo: titolo, autori: results[0], articolo: req.params.id_articolo})
                    }
                }
            });
        }
    });
}

exports.formTutorial=(req,res)=>{
    res.render('newtutorial');

}

exports.creaTutorial=(req,res)=>{
    res.render('newtutorial');

}

/*exports.assegnaAutori=(req,res)=>{
    res.render('index');
}*/

