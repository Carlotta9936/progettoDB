var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');    //Motore grafico

app.use(logger('dev'));
//Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false}));
//Parse JSON bodies (ad sent by API clients)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Importo per i moduli per indirizzamento
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


//Indirizzamento
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/conferenza',require('./routes/conferenza'));
app.use('/sponsor',require('./routes/sponsor'));
app.use('/sponsorizzazione',require('./routes/sponsorizzazione'));
//app.use('/programma_giornaliero',require('./routes/programma_giornaliero'));



const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
})

//Connessione al database
db.connect((err, result) => {
  if(err) {
      console.log(err)
  } else {
      console.log("MySQL conneceted!")
  }
})


app.get('/sponsor',function(req,res){
  let sql='SELECT * FROM sponsor';
  db.query(sql,function(err,results){
      if(err) throw err;
      res.send(results);
  })
});

app.get('/conferenza',function(req,res){
  let sql='SELECT * FROM conferenza';
  db.query(sql,function(err,results){
      if(err) throw err;
      res.send(results);
  })
});

app.get('/sponsorizzazione',function(req,res){
  let sql='SELECT * FROM sponsorizzazione';
  db.query(sql,function(err,results){
      if(err) throw err;
      res.send(results);
  })
});

app.get('/programma_giornaliero',function(req,res){
  let sql='SELECT * FROM programma_giornaliero';
  db.query(sql,function(err,results){
      if(err) throw err;
      res.send(results);
  })
});

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
