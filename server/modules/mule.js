const request = require('request');
const config = require('../config/config');

module.exports.getUserData = function (data,event,env){
    //let mule = env === 'dev' ? config.muleUrl.local : env === 'test' ? config.muleUrl.test : config.muleUrl.live;

    return new Promise((resolve,reject)=>{

        const url = config.muleUrl.dev + event;
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