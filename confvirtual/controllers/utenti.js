const mysql = require('mysql');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.signin = (req, res) => {
    console.log(req.body);

    const { username, password, passwordConfirm, nome, cognome, luogoNascita, dataNascita } = req.body;

    db.query(`SELECT username FROM utente WHERE username = "${username}"`, async (err, results) => {
        if(err) {console.log(err)};
        if(results.length > 0){     //Controllo dell'username non sia già usato
            return res.render('signin', {
                message: "That user is already use"
            })
        } else if(password !== passwordConfirm){    //Controllo che le password coincidano
            return res.render('signin', {
                message: "Password do not match"
            })
        }

        //let hashedPassword = await bcrypt.hash(password, 8);
        //console.log(hashedPassword);
        db.query(`INSERT INTO utente (username, password, nome, cognome, luogo_nascita, data_nascita) VALUES ('${username}', '${password}', '${nome}', '${cognome}', '${luogoNascita}', '${dataNascita}');`, (err, results) => {
            if(err) { 
                console.log(err);
            }
            else {
                console.log(results);
                res.render('signin', {message: 'User registered'});     //Dovrà rimandare alla home page
            }
        })
    });
}


exports.login = (req, res) => {
    const { name, password } = req.body;
    db.query(`SELECT * FROM utente WHERE username = '${name}' AND password = '${password}' `, (err, results) => {
        if(err) {console.log(err); }
        console.log(results.length);
        if(results.length>0){
            res.render('homepage');
        } else {
            res.render('login');
        }
    });
}

exports.update_administrator = (req, res) => {
    

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