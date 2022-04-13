var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db = require('./connectionDB');


var app = express();

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


//Indirizzamento
app.use('/', indexRouter);
app.use('/utenti', usersRouter);
app.use('/conferenza',conferenzaRouter);
app.use('/presentazione',presentazioneRouter);
app.use('/autore',autoreRouter);
app.use('/sponsor',sponsorRouter);
// ⇩ secondo me non servono
/*app.use('/sponsor',require('./routes/sponsor'));
app.use('/sponsorizzazione',require('./routes/sponsorizzazione'));
app.use('/presentazione',require('./routes/presentazione'));
app.use('/autore',require('./routes/autore'));*/


//Connessione al database
db.connect((err, result) => {
  if(err) {
      console.log(err)
  } else {
      console.log("MySQL conneceted!")
  }
})

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

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
