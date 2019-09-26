const request = require('request');
const config = require('../config/config').mule;

function mule (data,event,callback){
    const url = 'http://mule-dev.sw.buhl-data.com:8080/' + event;

    const auth =  Buffer.from('Statusmonitor:db41f2598fc1ecd2e407f3d8ce59fe78').toString("base64");
    const options = {
        url: url,
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + auth
        },
        form: data
    }

    request.post(options,(err,res)=>{
        if(res == undefined) return;
        let result = res.body;
        if(err){
            callback(`der Befehl konnte nicht ausgeführt werden : ${err}`);
        }else{
            if(option){
                callback(`der Befehl wurde erfolgreich ausgeführt`);
            }else{
                callback(result);
            }
        }
    });
}


function getUserData (data,event,env){

    return new Promise((resolve,reject)=>{
        
        const url =`${config.selectEnv(env)}` + event;
        const auth =  Buffer.from('Statusmonitor:db41f2598fc1ecd2e407f3d8ce59fe78').toString("base64");
        const options = {
            url: url,
            method: 'POST',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + auth
            },
            form: data
        }

        request.post(options,(err,res)=>{
            if(res == undefined) return;
            let result = res.body;
            resolve(result);
        });
    });
}

module.exports.mule = mule;
module.exports.getUserData = getUserData;

