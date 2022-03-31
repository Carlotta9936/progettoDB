const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var token;

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    multipleStatements: true
});

exports.signin = (req, res) => {
    console.log(req.body);

    const { username, password, passwordConfirm, nome, cognome, luogoNascita, dataNascita } = req.body;

    db.query(`SELECT username FROM utente WHERE username = "${username}"`, async (err, results) => {
        if(err) {console.log(err)};
        if(results.length > 0){     //Controllo dell'username non sia già usato
            return res.render('signin', {  message: "That user is already use" })
        } else if(password !== passwordConfirm){    //Controllo che le password coincidano
            return res.render('signin', { message: "Password do not match" })
        }

        //let hashedPassword = await bcrypt.hash(password, 8);
        //console.log(hashedPassword);
        db.query(`INSERT INTO utente (username, password, nome, cognome, luogo_nascita, data_nascita) VALUES ('${username}', '${password}', '${nome}', '${cognome}', '${luogoNascita}', '${dataNascita}'); 
                INSERT INTO ruoli (ruoli_username, ruolo) VALUES ('${username}', 'user')`, (err, results) => {
            if(err) { 
                console.log(err);
            }
            else {
                console.log(results);
                const payload = {
                    username: username,
                    diritti: 'user'
                };
    
                token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
                var decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
                res.render('profile', {user: decoded.username, ruolo: decoded.diritti});     //Dovrà rimandare alla home page
            }
        })
    });
}


exports.login = (req, res, next) => {
    //Autenticazione user e password
    const { name, password } = req.body;
    db.query(`SELECT * FROM utente WHERE username = '${name}' AND password = '${password}'; SELECT ruolo FROM ruoli WHERE ruoli_username = '${name}'`, (err, results) => {
        if(err) {console.log(err); }
        if(results[0].length>0){
            //user e password combaciano
            console.log(results[1][0]);
            const payload = {
                username: name,
                diritti: results[1][0].ruolo
            };

            token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
            next();
                        
        } else {
            //Messaggio errore user o password sbagliati
            res.render('login', {message: "Username o password sbagliati, riprova"});
        }
    });
}

exports.profile = (req, res) => {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    res.render('profile', {user: decoded.username, ruolo: decoded.diritti});
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
        res.send(results);
    });
};


exports.update_administrator = (req, res) => {
    var decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    db.query(`INSERT INTO amministratore (usernameAdmin) VALUES ('${decoded.username}'); UPDATE ruoli SET ruolo = 'admin' WHERE (ruoli_username = '${decoded.username}');`);
    const payload = {
        username: decoded.name,
        diritti: 'admin'
    };

    token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
    res.render('profile', {user: decoded.username, ruolo: decoded.diritti});
} 