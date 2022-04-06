//Modulo per la connessione al server mysql
var mysql = require("mysql");
//Per le password
const dotenv = require('dotenv');
dotenv.config({ path: './.env'});

var database = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD
});

module.exports = database;