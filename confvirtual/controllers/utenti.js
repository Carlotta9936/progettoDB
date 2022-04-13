const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../connectionDB');
var cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');


var token;

//Registra un nuovo utente
exports.signin = (req, res, next) => {
    const { username, password, passwordConfirm, nome, cognome, luogoNascita, dataNascita } = req.body;

    db.query(`call trovaUtente("${username}");`, async (err, results) => {
        if(err) {console.log(err)};
        if(results[0].length > 0){     //Controllo dell'username non sia già usato
            res.render('signin', {  message: "That user is already use" })
        } else if(password !== passwordConfirm){    //Controllo che le password coincidano
            res.render('signin', { message: "Password do not match" })
        }
        
        //let hashedPassword = await bcrypt.hash(password, 8);
        //console.log(hashedPassword);
        db.query(`call inserisciNuovoUtente('${username}', '${password}', '${nome}', '${cognome}', '${luogoNascita}', '${dataNascita}'); `, (err, results) => {
            if(err) { 
                console.log(err);
            }
            else {
                //console.log(results);
                const payload = {
                    username: username,
                    diritti: 'Utente'
                };
    
                token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
                res.cookie('token', token);
                next();     //Dovrà rimandare alla home page
            }
        })
    });
}


exports.login = (req, res, next) => {
    //Autenticazione user e password
    const { name, password } = req.body;
    var ruolo;
    db.query(`call autenticazione('${name}', '${password}'); call controlloRuoli('${name}')`, (err, results) => {
        console.log(name);
        console.log(password);
        if(err) {console.log(err); }       
        if(results[0].length>0){    //user e password combaciano
            if(results[1].length === 0) {
                ruolo = "Utente";
            } else {
                ruolo = results[1][0].ruolo
            }

            console.log(ruolo);
            const payload = {
                username: name,
                diritti: ruolo
            };

            token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
            res.cookie('token', token);
            next();
                        
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
            console.log("coglione non puoi avere due ruoli");
        }
    })
}

exports.update_administrator = (req, res) => {
    var decoded = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
    db.query(`call updateAmministratore('${decoded.username}')`);
    
    const payload = {
        username: decoded.username,
        diritti: 'admin'
    };

    token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
    res.cookie('token', token);
    res.render('profile', {user: decoded.username, ruolo: decoded.diritti});
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
                        diritti: 'presenter'
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
        
    });
    //riaggiorna il token
    const payload = {
        username: decoded.name,
        diritti: 'speaker'
    };

    token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
    res.cookie('token', token);
    res.redirect('/profilo');
}