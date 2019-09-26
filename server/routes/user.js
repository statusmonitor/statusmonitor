const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/config');

router.get('/user/login',(req,res)=>{
    //redirected  url  : http://weblogin.sw.buhl-data.com/v0/login/60
    //res.writeHead(302, { "Location": `${config.weblogin.weblogin.server}/v0/login/${config.weblogin.weblogin.service}`});
    //res.end();
});

router.get('/user/checkAuth',(req,res)=>{
    if(req.sessionID)res.status(200).send( JSON.stringify(req.sessionID));
    else res.status(200).send(false);
});

router.get('/user/login/:id',(req,res)=>{
    let user = req.params.id;
    let payload = {subject:user};
    let token = jwt.sign(payload,'scretkey');
    res.status(200).send({token});
});


exports.router = router;

