const request = require('request');
const config = require('../config/config').mule;
let io;

module.exports = {

    io : function(socket){io = socket;},

    fetch : function (event,env,callbackEvent){
        const ev = event;
        const url = 'http://mule-dev.sw.buhl-data.com:8080/kontaktcenteradministration/' + event;
        //
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
            let data;

            if(!res) {
                console.error(`response ist leer. event: ${ev} env: ${env}`);
                return;
            }
            try {
                data = JSON.parse(res.body);
              } catch (e) {
                io.emit('state', `Empty response error:${config.convertEnv(env)}`);
                return console.error(e);
              }

              let room = config.convertEnv(env);
              data.target = env;

            if(callbackEvent){
                if (room) {
                    io.to(room).emit(callbackEvent, data);
                } else {
                    console.error(`room: ${event} konnte nicht finden. event: ${event} env: ${env}`);
                    io.emit(callbackEvent,data);
                }
            }
        });
    }
}
