const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../connectionDB');
var cookieParser = require('cookie-parser');
var {createLog, updateLog} = require('../modules/connectionDBMongo');

var token;

//Registra un nuovo utente
exports.signUp = (req, res, next) => {
    const { username, password, passwordConfirm, nome, cognome, luogoNascita, dataNascita } = req.body;

    db.query(`call trovaUtente("${username}");`, async (err, results) => {
        if(err) {console.log(err)};
        if(results[0].length > 0){     //Controllo dell'username non sia già usato
            res.render('signUp', {  message: "That user is already use" })
        } else if(password !== passwordConfirm){    //Controllo che le password coincidano
            res.render('signUp', { message: "Password do not match" })
        }
        
        //let hashedPassword = await bcrypt.hash(password, 8);
        //console.log(hashedPassword);
        db.query(`call inserisciNuovoUtente('${username}', '${password}', '${nome}', '${cognome}', '${luogoNascita}', '${dataNascita}'); `, (err, results) => {
            if(err) { 
                console.log(err);
            }
            else {
                const orario = Date.now();

                createLog({utente: username, login: orario}).then(
                    function(idLog) { //Creo il token
                        const payload = {
                            username: username,
                            diritti: 'Utente',
                            log: idLog
                        };
    
                    token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
                    res.cookie('token', token);
                
                    next();     //Dovrà rimandare alla home page
                } 
                )
            }
        })
    });
}


exports.login = (req, res, next) => {
    //Autenticazione user e password
    const { name, password } = req.body;
    var ruolo;
    db.query(`call autenticazione('${name}', '${password}'); call controlloRuoli('${name}')`, (err, results) => {
        if(err) {console.log(err); }  
        console.log("sus",results)     
        if(results[0].length>0){    //user e password combaciano
            if(results[2].length === 0) {
                ruolo = "Utente";
            } else {
                ruolo = results[2][0].ruolo
            }

            //Creo il log
            const orario = Date.now();

            createLog({utente: name, login: orario}).then(
                function(idLog) { //Creo il token
                    const payload = {
                        username: name,
                        diritti: ruolo,
                        log: idLog
                    };
                    token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
        
                    //Creo il cookie
                    res.cookie('token', token);
                    
                    next(); 
                },
                function(error) { console.log("Errore mongo(loide): ", error);}
              );

            //var i  = Promise.resolve(idLog);
            //createLog({utente: name, login: orario}).then();

        } else {
            //Messaggio errore user o password sbagliati
            res.render('login', {message: "Username o password sbagliati, riprova"});
        }
    });
}

//reindirizza alla homepage
exports.profile = (req, res) => {
    res.redirect('/homepage');
}


//Ricerca tutte le pagine utente
exports.users_page = function(req, res){
    let sql = `SELECT *
                FROM utente`;
    db.query(sql, function(err, results){
        if(err) throw err;
        res.send(results);
    });
}


//Ricerca una pagina utente per ID
exports.user_page = function(req, res){

    let sql = `SELECT * 
                FROM utente
                WHERE username = "${req.params.id}"`;

    db.query(sql, function(err, results){
        if(err) throw err;
        //if(req.params.id === id del cookie renderizza un'altra pagina
        res.send(results);
    });
};

exports.controlloDiritti = (req, res, next) => {
    var decoded = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
    db.query(`call controlloRuoli('${decoded.username}')`, (err, results) => {
        if(err) { throw err; }
        if(results[0][0]===undefined) {
            next(); 
        }
        else {
            console.log("Non puoi avere due ruoli");
        }
    })
}

exports.update_administrator = (req, res) => {
    var decoded = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
    db.query(`call updateAmministratore('${decoded.username}')`, (err, result) => {
        if(err) {throw err;}
        updateLog(`${decoded.log}`, {upgrade: 'Admin'});
        const payload = {
            username: decoded.username,
            diritti: 'Admin'
        };
    
        token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
        res.cookie('token', token);
        res.redirect("utenti/"+decoded.username);
    });
    
} 

exports.form_presenter = (req, res) => {
    res.render('formPresenter');
}

exports.form_speaker = (req, res) => {
    res.render('formSpeaker');
}

exports.update_presenter = (req, res) => {
    var decoded = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
    const {uni, dipartimento} = req.body;
    var files = req.files;

    //const {name, img} = req.files.image;
    db.query(`call updatePresenter ('${decoded.username}', '${uni}','${dipartimento}', '${files.image[0].filename}', '${files.cv[0].filename}')`, (err, results) => {
        if(err) { throw err;} 
        //query che prende id del nuovo presenter
        db.query(`call selectpresenter ()`,(err,result)=>{
            if(err) { throw err;} 
            console.log(result[0]);
            updateLog(`${decoded.log}`, {upgrade: 'Presenter'});
            var id=parseInt(result[0][0].massimo);
            id=1000+id;
            var username= result[0][0].usernamePresenter;

            //query che prende i dati utente del presenter
            db.query(`call selectutente ('${username}')`,(err,results)=>{
                if(err) { throw err;} 
                console.log(results[0]);
                var nome=results[0][0].nome;
                var cognome=results[0][0].cognome;
                //query va inserire il presenter tra gli autori
                db.query(`call autorepresenter('${id}', '${nome}','${cognome}')`,(err,results)=>{
                    if(err) { throw err;} 
                    //riaggiorna il token
                    const payload = {
                        username: decoded.username,
                        diritti: 'Presenter'
                    };

                    token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
                    res.cookie('token', token);
                    res.redirect('/profilo');
                });
            });
        });
    });
}

exports.update_speaker= (req, res) => {
    var decoded = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
    const {uni, dipartimento} = req.body;
    var files = req.files;
    console.debug(req)
    db.query(`call updateSpeaker ('${decoded.username}', '${uni}','${dipartimento}', '${files.image[0].filename}', '${files.cv[0].filename}')`, (err, results) => {
        if(err) { throw err;} 
        updateLog(`${decoded.log}`, {upgrade: 'Speaker'});
        
    });
    //riaggiorna il token
    const payload = {
        username: decoded.username,
        diritti: 'Speaker'
    };

    token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
    res.cookie('token', token);
    res.redirect('/profilo');
}