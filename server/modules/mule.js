const request = require('request');
const config = require('../config/config').mule;

module.exports.getUserData = function (data,event,env){

    return new Promise((resolve,reject)=>{
        const ev = event;
        const url =`${config.selectEnv(config.convertEnv(env))}` + event;
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
            if(res == undefined) {
                reject(`response ist leer. event: ${ev} env: ${env}`);
                return;
            }
            let result = res.body;
            resolve(result);
        });
    });
}
