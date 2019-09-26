const express = require('express');
const router = express.Router();
const call = require('../modules/fetch.js');
let errorListHash;

setInterval(call.fetch,5000,'myState',"dev1","CallMuleState");
setInterval(call.fetch,5000,'myState',"dev2","CallMuleState");
//setInterval(call.fetch,5000,'myState',"test1");
//setInterval(call.fetch,5000,'myState',"test2");
//setInterval(call.fetch,5000,'myState',"live1");
//setInterval(call.fetch,5000,'myState',"live2");

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
        call.fetch(event,"test","callAllServerState");
        call.fetch(event,"dev","callAllServerState");
        call.fetch(event,"live","callAllServerState");
        res.status(200).send();
    }else{
        res.status(200).send();
    }
});

router.post('/event/muleErrorList',(req,res)=>{
    let event = req.body.event;
    if(errorListHash !== req.body.data){
        errorListHash = req.body.data;
        call.fetch(event,"test","callErrorList");
        call.fetch(event,"dev","callErrorList");
        call.fetch(event,"live","callErrorList");
        res.status(200).send();
    }else{
        res.status(200).send();
    }
});


module.exports.router = router;
