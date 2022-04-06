var express = require("express");
var app = express();
var database = require('./database');
var {readFile} = require('fs');

app.get('/', function(req, res){
    let sql = readFile('query.sql', function(err, result){
        if(err) throw err;
    });
    database.query(sql, function(err, results){
        if(err) throw err;
        res.send(results);
    });
})

app.listen(3000, function(){
    console.log("App listening on port 3000");
    database.connect(function(err){
        if(err) throw err;
        console.log("Database connected");
    })
});