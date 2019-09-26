const request = require('request');
const config = require('../config/config').mule;
let io;

function fetch (event,env,callbackEvent){
    const url = `${config.selectEnv(env)}kontaktcenteradministration/${event}`;
    const auth =  Buffer.from('Statusmonitor:db41f2598fc1ecd2e407f3d8ce59fe78').toString("base64");
    const postData = {"env": config.convertEnv(env)};
    const options = {
        url: url,
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + auth
        },
        form: postData
    }

    request.post(options,(err,res)=>{
        if(!res) return;
        let data = JSON.parse(res.body);
        data.target = env;
        let room = config.convertEnv(env);
        if(callbackEvent){
            if (room) {
                io.to(room).emit(callbackEvent, data);
            } else {
                console.log("room ist nicht mehr vorhanden : " + room);
                io.emit(callbackEvent,data);
            }
        }
    });
}

module.exports.fetch = fetch;
module.exports.io = function(socket){io = socket;}
