const express = require('express');
const router = express.Router();
const call = require('../modules/fetch.js');
const config = require('../config/config');

setInterval(call.fetch,5000,'myState',"dev1","CallMuleState");
setInterval(call.fetch,5000,'myState',"dev2","CallMuleState");
setInterval(call.fetch,5000,'myState',"test1","CallMuleState");
setInterval(call.fetch,5000,'myState',"test2","CallMuleState");
setInterval(call.fetch,5000,'myState',"live1","CallMuleState");
setInterval(call.fetch,5000,'myState',"live2","CallMuleState");


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

     if(req.body.data){
        call.fetch(event, config.env.TEST, "callAllServerState");
        call.fetch(event, config.env.DEV, "callAllServerState");
        call.fetch(event, config.env.LIVE, "callAllServerState");
        res.status(200).send();
    }else{
        res.status(200).send();
    }
});

router.post('/event/muleErrorList',(req,res)=>{
    let event = req.body.event;

    if(req.body.data){
        call.fetch(event, config.env.TEST, "callErrorList");
        call.fetch(event, config.env.DEV, "callErrorList");
        call.fetch(event, config.env.LIVE, "callErrorList");
        res.status(200).send();
    }else{
        res.status(200).send();
    }
});

module.exports.router = router;
