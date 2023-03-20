const express = require('express');
const app = express();
const http = require('http').Server(app);
var cors = require("cors");

app.use(cors());

const {Client} = require('pg');

const client = new Client({
    host: "snuffleupagus.db.elephantsql.com",
    user: "ugejzchr",
    port: 5432,
    password: "6-Eki9sktGOUOBjn5GyT89KfbJC62zgP",
    database: "uzman"
})

client.connect();

const port = process.env.port || 8000 ;


function getSorular(req, res){
    var limitNo
    if(req.params.sectionid == 1){
        limitNo = 30;
        offsetNo = 0;
    }
    if(req.params.sectionid == 2){
        limitNo = 20;
        offsetNo = 30;
    }
    if(req.params.sectionid == 3){
        offsetNo = 50;
        limitNo = 18;
    }
    if(req.params.sectionid == 4){
        offsetNo = 68;
        limitNo = 6;
    }
    
    client.query(`select * from sorular LIMIT ${limitNo} OFFSET ${offsetNo}`, (err, result)=>{
        if(!err)
            console.log("Successful query :)");
        else 
            console.log(err);

            
        res.json(result.rows);
    })
    client.end;
}

function getBolum(req, res){
    client.query(`select * from bolumler`, (err, result)=>{
        if(!err){
            console.log("Successful query :)");
            res.json(result.rows);
        }
        else 
            console.log(err);

            
    })
    client.end;
}

function getUniversite(req, res){
    client.query(`select universitead, bolum, siralama from universiteler where bolumid = ${req.params.bolumid} and siralama > 0.9*${req.params.siralama} ORDER BY siralama`, (err, result)=>{
        if(!err){
            console.log("Successful query :)");
            res.json(result.rows);
        }
        else 
            console.log(err);
    })
    client.end;
}

function getBasari(req, res){
    client.query(`select * from basari`, (err, result)=>{
        if(!err)
            console.log("Successful query :)");
        else 
            console.log(err);

            
        res.json(result.rows);
    })
    client.end;
}

function getKatsayilar(req, res){
    client.query(`select * from katsayi`, (err, result)=>{
        if(!err)
            console.log("Successful query :)");
        else 
            console.log(err);

            
        res.json(result.rows);
    })
    client.end;
}

function updateBasari(req, res){
    client.query(`UPDATE basari SET toplam = toplam + 3, basarili = basarili + ${req.params.successful}`, (err, result)=>{
        if(!err)
            console.log("Successful query :)");
        else 
            console.log(err);

            
        res.json(result.rows);
    })
    client.end;
}

app.get(('/'), function(req, res){
    res.sendFile("./index.html");
})

app.get(('/api/sorular/:sectionid'), getSorular)

app.get(('/api/universite/:bolumid/:siralama'), getUniversite)

app.get(('/api/bolum'), getBolum)

app.get(('/api/katsayilar'), getKatsayilar)

app.get(('/api/basari/:successful'), updateBasari)

app.get(('/api/basarioran'), getBasari)


http.listen(port, () => {})
