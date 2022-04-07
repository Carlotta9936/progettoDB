const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../connectionDB');
var cookieParser = require('cookie-parser');

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
        db.query(`call inserisciNuovoUtente('${username}', '${password}', '${nome}', '${cognome}', '${luogoNascita}', '${dataNascita}'); 
                INSERT INTO ruoli (ruoli_username, ruolo) VALUES ('${username}', 'user')`, (err, results) => {
            if(err) { 
                console.log(err);
            }
            else {
                //console.log(results);
                const payload = {
                    username: username,
                    diritti: 'user'
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
    db.query(`call autenticazione('${name}', '${password}')`, (err, results) => {
        if(err) {console.log(err); }
        if(results[0].length>0){
            //user e password combaciano
            const payload = {
                username: name,
                diritti: results[1][0].ruolo
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


exports.update_administrator = (req, res) => {
    var decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    db.query(`call updateAmministratore(${decoded.name})`);
    
    const payload = {
        username: decoded.name,
        diritti: 'admin'
    };

    token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
    res.render('profile', {user: decoded.username, ruolo: decoded.diritti});
} 