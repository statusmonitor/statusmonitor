const express = require('express');
const router = express.Router();
const call = require('../modules/fetch.js');
let errorListHash;
//let config = require('../config/config');

setInterval(call.fetch,5000,'Statusmonitor_getMyState',"test");
setInterval(call.fetch,5000,'Statusmonitor_getMyState',"dev");
setInterval(call.fetch,5000,'Statusmonitor_getMyState',"live");

router.all('/event/*',(req,res,next)=>{
    let auth = req.query.auth;

    if (auth !== "d3289z23dc8h237e0293d7as80") {
        res.status(401).send("Unauthorized");
        return;
    }
    next();
});

router.post('/event/allState',(req,res)=>{
     let event = req.body.event;
     let env = req.body.env;
     if(req.body.data){
        call.fetch(event,"test");
        call.fetch(event,"dev");
        call.fetch(event,"live");
        res.status(200).send();
    }else{
        res.status(200).send();
    }
});

router.post('/event/muleErrorList',(req,res)=>{
    let event = req.body.event;
    if(errorListHash !== req.body.data){
        errorListHash = req.body.data;
        call.fetch(event,"test");
        call.fetch(event,"dev");
        call.fetch(event,"live");
        res.status(200).send();
    }else{
        res.status(200).send();
    }
});


module.exports.router = router;
