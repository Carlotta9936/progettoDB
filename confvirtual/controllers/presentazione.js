const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../connectionDB');
const controlloDate = require('../modules/controlloDate');
const { DateTime } = require('luxon');



exports.formPresentazione = (req, res)=>{
    //query per visualizzare dati di una sessione
    db.query(`call specificasessione ('${req.params.sessione}')`,(err,results)=>{
        if(err) throw err;
        console.log(results[0]);
        results[0][0].data = DateTime.fromJSDate(results[0][0].data).toLocaleString(DateTime.DATE_MED);
        res.render('newpresentazione',{sessione: results[0],errore: false, msg: ""});
    });
}


exports.creaPresentazione = (req,res)=>{
    let {oraI, oraF, ordine, tipo} = req.body;
    db.query(`call getSessione('${req.params.sessione}')`, (err, result) => {
        if(err) {throw err;}
        //result[0][0].ora_i = DateTime.fromJSDate(result[0][0].ora_i).toLocaleString(DateTime.DATE_MED);
        if(controlloDate.controlloOrario(oraI, oraF) &&     //L'orario di inizio deve essere prima dell'orario d'inizio
            controlloDate.controlloOrario(result[0][0].ora_i, oraI) && controlloDate.controlloOrario(oraF, result[0][0].ora_f))
        {   //L'orario delle presentazioni non può eccedere quello della sessione
            db.query(`call getPresentazioni('${req.params.sessione}')`, (err, results) => {
                if(err) { throw err; }
                var i;
                for(i=0; i<results[0].length; i++){
                    console.log(oraI);
                    console.log(oraF);
                    console.log(results[0][i].oraInizio);
                    console.log(results[0][i].oraFine);
                    if(!(controlloDate.controlloOrario(oraI, results[0][i].oraInizio) && controlloDate.controlloDate(oraF, results[0][i].oraInizio) ||
                        controlloDate.controlloOrario(results[0][i].oraFine, oraF) && controlloDate.controlloDate(results[0][i].oraFine, oraI)))
                    {//query per prendere i dati per reinderizzare quando c'è un problema
                        db.query(`call specificasessione ('${req.params.sessione}')`,(err,results)=>{
                            if(err) throw err;
                            console.log(results[0]);
                            results[0][0].data = DateTime.fromJSDate(results[0][0].data).toLocaleString(DateTime.DATE_MED);
                            res.render('newpresentazione',{sessione: results[0], errore: true, msg: "la presentazione deve iniziare dopo l'inizio della sessione, finire prima della fine della sessione e non può coincidere con altre presentazioni della sessione"});
                        });
                    }
                }
                do{
                    console.log(" ");
                }while(i<results[0].length);
                if(oraI<oraF){
                    db.query(`call insertpresentazione('${oraI}','${oraF}','${ordine}','${req.params.sessione}');`,(err,results)=>{
                        if (err){throw err;}
                        tipo=req.body.tipo;
                        //query per prendere l'ultima presentazione creata
                        db.query(`call selezionapresentazione ()`,(err,results)=>{
                            if(err){
                                //console.log(results);
                                console.log(err);
                            }else{
                                //console.log(results[0]);
                                res.redirect(tipo+'/'+results[0][0].id);
                            }
                        });
                    }); 
                }
                else{
                    res.render('newpresentazione',{sessione: results[0], errore: true, msg: "la presentazione non può finire prima dell'orario di inizio"}); 
                }
            });
        } else {
           //query per prendere i dati per reinderizzare quando cìè un problema
           db.query(`call specificasessione ('${req.params.sessione}')`,(err,results)=>{
            if(err) throw err;
            console.log(results[0]);
            results[0][0].data = DateTime.fromJSDate(results[0][0].data).toLocaleString(DateTime.DATE_MED);
            res.render('newpresentazione',{sessione: results[0], errore: true, msg: "la presentazione deve iniziare dopo l'inizio della sessione e finire prima della fine della sessione"});
            });
        }
    });
}

//view per la creazione di articoli
exports.formArticolo=(req,res)=>{
    console.log(req.params.id_articolo);
    res.render('newarticolo',{articolo: req.params.id_articolo, msg:""});
}

//creao articolo senza l'assegnazione del presenter
exports.creaArticolo=(req,res)=>{
    const {pagine, titolo}= req.body;
    const PDF = req.files.PDF;
    db.query(`call insertarticolo ('${req.params.id_articolo}','${PDF[0].filename}','${pagine}','${titolo}')`,(err,results)=>{
        if(err){
            if (err.code === 'ER_TRUNCATED_WRONG_VALUE'){   
                res.render('newarticolo',{articolo: req.params.id_articolo, msg:"non tutti i dati sono correttirs"});
            }else{ throw err; }
        }else{
            //vado a controllare che gli autori dell'articolo esistano sul db, se non esistono devo crearli
            db.query(`call visualizzaautori ()`,(err,results)=>{
                if (err){throw err;}
                if(results.length==0){
                    res.render('newautore',{msg: "", articolo: req.params.id_articolo})
                }else{
                    //console.log(req.params.id_articolo);
                    //query per prendere autori che siano anche presenter
                    db.query(`call visualizzaautoripresenter ()`,(err,result)=>{
                        if(err) {throw err;}
                        res.render('assegnaAutori',{titolo: titolo, autori: results[0], articolo: req.params.id_articolo, presenter: result[0], errore: false, msg: ""})
                    });
                }
            });
        }
    });
}

//view per la creazione di articoli
exports.formTutorial=(req,res)=>{
    console.log(req.params.id_tutorial);
    res.render('newtutorial',{tutorial: req.params.id_tutorial});
}

//creo tutorial
exports.creaTutorial=(req,res)=>{
    const {titolo, abstract}= req.body;
    //query per inserire il tutorial
    db.query(`call inserttutorial('${req.params.id_tutorial}','${titolo}','${abstract}')`,(err,results)=>{
        if (err){throw(err)};
        //query controllare ci siano degli speaker
        db.query(`call verificaspeaker()`,(err,results)=>{
            if (err){throw(err)};
            if(results.length==0){
                res.render('errorspeaker');
            }else{
                res.render('associaspeaker',{speaker: results[0], tutorial: req.params.id_tutorial});
            }
        });
    });
}

exports.associaSpeaker=(req,res)=>{
    //query per associare tutti gli speaker al tutorial creato
    const {listaspeaker}=req.body;
    console.log(listaspeaker);
    if(listaspeaker!==undefined){
        if(Array.isArray(listaspeaker)){
            listaspeaker.forEach((speaker)=>{
                db.query(`call insertpresenta ('${speaker}', '${req.params.id_tutorial}')`,(err,results)=>{  
                    if(err){throw err};
                });
            });
            //query per prendere i dati della conferenza
            db.query(`call presentazioneInConferenza ('${req.params.id_tutorial}')`,(err,ris)=>{  
                if(err){throw err};
                res.redirect("/conferenza/"+ris[0][0].acronimo+"/"+ris[0][0].anno);
            });
        }else{//caso in cui sia solo uno speaker
            db.query(`call insertpresenta ('${listaspeaker}', '${req.params.id_tutorial}')`,(err,results)=>{  
                if(err){throw err};
                //query per prendere i dati della conferenza
                db.query(`call presentazioneInConferenza ('${req.params.id_tutorial}')`,(err,result)=>{  
                    if(err){throw err};
                    
                    res.redirect("/conferenza/"+result[0][0].acronimo+"/"+result[0][0].anno);

                });
            });
        }
    }else{
        console.log("ok");
        res.render("errorspeaker");
    }
}


exports.formParoleChiave=(req,res)=>{
    res.render('newParole',{articolo: req.params.id_articolo, error: false, msg: "",parola: "" });
}

exports.creaParoleChiave=(req,res)=>{
    let {parole}= req.body;
    parole=parole.toLowerCase();
    //query per inserire una parola
    db.query(`call insertparola ('${parole}','${req.params.id_articolo}')`,(err,results)=>{
        if(err){throw err;}
        res.render('newParole',{articolo: req.params.id_articolo, error: false, msg: "nuova parola creata: ", parola: parole});

    });
}


