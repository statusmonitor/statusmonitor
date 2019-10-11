const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('../config/config');
const mule = require('../modules/mule').getUserData;
const checkAuth = require('../lib/auth');

router.get('/weblogin/*',(req,res)=>{
    let weblogin = req.query.weblogin;
    if(!weblogin){
        res.status(400).send("bed request.");
        return;
    }
    webloginCheck(weblogin,req,res);
});

function webloginCheck (weblogin,req,res){
    const url = config.weblogin.weblogin.server + "/v0/check/" + config.weblogin.weblogin.service_local + "/" + weblogin;
    const options = {
        url: url,
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    };
    request.get(options,(err,res2)=>{
        if(!res2){
            console.error(`response ist leer. event: webloginCheck`);
            return;
        } 
        let authdata = JSON.parse(res2.body);
        session(req,res,authdata);
    });
}

function session(req, res, authdata) {

    let userdata = {};
    let rights = {};
    let sessionID = req.sessionID;
    let _obj = {
        "user_ldap": authdata.username,
        "env": config.env
    }; 

    searchbyusername(_obj)
    .then((data)=>{
            if(data)userdata = data;

            getMyRights(_obj)
            .then((data)=>{
                if(data)rights = data;
                hasAuth(req,res,sessionID,rights,userdata);
            },(error)=>{console.error(error)});
            
    },(error)=>{console.error(error)});
}

function hasAuth(req,res,sessionID,rights,userdata){

    let hasAuth = checkAuth.hasAuth(rights);
    let complexdata = JSON.parse(userdata).complexdata;
    req.session.is_logined = true;
    req.session.firstname = `${complexdata.surname}`;
    req.session.lastname = `${complexdata.givenname}`;
    req.session.fullname = `${complexdata.fullname}`;
    req.session.env = `${userdata.env}`;
    req.session.rights = `${rights}`;
    req.session.hasAuth = hasAuth;

    req.session.save(()=>{
        if(hasAuth){
            res.redirect(`${config.weblogin.redirect.pageLocal}?user=${req.session.fullname}&sessionID=${sessionID}`);
        }else {
            console.error(`Unauthorized user ${req.session.fullname}`);
            res.status(401).send('Unauthorized');
        }
    });
}

function searchbyusername(data) {
    let getUserdataUrl = "kontaktcenter/ldap/searchbyusername";
    return mule(data,getUserdataUrl,config.env);
}

function getMyRights(data) {
    let getRights = "kontaktcenteradministration/Rights_getMyRights";
    return mule(data,getRights,config.env);
}

module.exports.router = router;



