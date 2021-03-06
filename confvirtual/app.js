var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db = require('./connectionDB');
var http =require("http");
var socketio=require("socket.io");
const { MongoClient } = require('mongodb');
const URI = process.env.URI;
const mongo = new MongoClient(URI);
const { DateTime } = require('luxon');
var app = express();
var cookie = require("cookie");
const {updateLog} = require('./modules/connectionDBMongo');

const server = require('http').createServer(app);
const io = socketio(server);
const jwt= require("jsonwebtoken");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');    //Motore grafico

app.use(logger('dev'));
//Parse URL-encoded bodies (as sent by HTML forms)
//app.use(express.urlencoded({ extended: false}));
//Parse JSON bodies (ad sent by API clients)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Importo per i moduli per indirizzamento
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var conferenzaRouter = require('./routes/conferenza');
var presentazioneRouter= require('./routes/presentazione');
var autoreRouter= require('./routes/autore');
var sponsorRouter =require ('./routes/sponsor');
var risorsaRouter= require ('./routes/risorseAggiuntive');
var articoloRouter= require ('./routes/articolo');
var tutorialRouter=require ('./routes/tutorial');
var ricercaRouter = require ('./routes/ricerca');

//Indirizzamento
app.use('/', indexRouter);
app.use('/utenti', usersRouter);
app.use('/conferenza',conferenzaRouter);
app.use('/presentazione',presentazioneRouter);
app.use('/autore',autoreRouter);
app.use('/sponsor',sponsorRouter);
app.use('/risorseAggiuntive', risorsaRouter);
app.use('/articolo',articoloRouter);
app.use('/tutorial',tutorialRouter);
app.use('/ricerca/', ricercaRouter);
// ??? secondo me non servono
/*app.use('/sponsor',require('./routes/sponsor'));
app.use('/sponsorizzazione',require('./routes/sponsorizzazione'));
app.use('/presentazione',require('./routes/presentazione'));
app.use('/autore',require('./routes/autore'));*/
var user;
var time;
var sessione;

app.get('/:id_sessione/chat', (req, res) => {
  //res.sendFile(__dirname + '/index.html');
    sessione=req.params.id_sessione;
    console.log(sessione);
    //user = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
    //user = user.username;
   // console.log(user.username);
    const today= new Date();
    const giorno= DateTime.fromJSDate(today).toLocaleString(DateTime.DATE_MED);
    const orario= today.toLocaleTimeString();//prendo l'ora attuale

    //controllo se la sessione ?? attiva
    db.query(`call verificaorariosessione ('${sessione}')`,(err,result)=>{
      var data=DateTime.fromJSDate(result[0][0].data).toLocaleString(DateTime.DATE_MED);
      console.log(giorno,data);
      if(giorno==data){
        if(orario<result[0].orai || orario>result[0].oraf){
          res.render("chatnondisponibile");
        }else{
          //query per stampare i messaggi della chat se gi?? ce ne sono
          db.query(`call stampamessaggi('${req.params.id_sessione}')`,(err,results)=>{
            if(err) {throw err;}
            if(results[0].length==0){
              console.log("ciao");
              res.render("chatvuota");
            }else{
              //console.log(results[0]);
              res.render("chat", {messaggi: results[0]});
            }
          }); 
        }
      }else{
        res.render("chatnondisponibile");
      }
    });
});


io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    var cookief = socket.handshake.headers.cookie; 
    var cookies = cookie.parse(cookief); 
    console.log(cookies);
    user = jwt.verify(cookies.token, process.env.ACCESS_TOKEN_SECRET);
    console.log("scrive: ", user)
    time= new Date();
    time=time.toLocaleTimeString();
    //query per prendere la data della sessione
    db.query(`call sessionedata ('${sessione}')`,(err,result)=>{
      if(err){
        console.log(err);
      }else{
        let data= new Date(result[0][0].data).toISOString().replace('T', ' ').replace('Z', '')
        console.log(data);
        console.log(user.username);

        //query che registra il messaggio sul db
        db.query(`call insertmessaggio ('${time}', '${sessione}','${user.username}', '${msg}','${data}')`,(err,results)=>{  
          if(err){ console.log(err); }
          io.emit('chat message', user.username + ": "+msg+ "["+time+"]");
          updateLog(`${user.log}`, {messaggioInviato: `${msg} - in - ${sessione}`})


        });
      }
    });
    
  });
});

//Connessione al database MySQL
db.connect((err, result) => {
  if(err) {
      console.log(err)
  } else {
      console.log("MySQL conneceted!")
  }
})

//Connessione al database NoSQL
mongo.connect((err) => {
  if(err) {
    console.log(err)
  } else {
      console.log("MongoDB conneceted!")
  }
});



//const databasesList = client.db().admin().listDatabases();

app.use(cookieParser());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  if(err.message === "jwt must be provided"){
    res.render('login',{message: ""});
  }

  if(err.status === 404){
    res.render('notFound');
  }
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = { app: app, server: server };
