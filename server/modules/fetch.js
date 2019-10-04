const request = require('request');
let io;

module.exports = {

    io : function(socket){io = socket;},
    
    fetch : function (event,env){
        const ev = event;
        const url = 'http://mule-dev.sw.buhl-data.com:8080/kontaktcenteradministration/' + event;
        const auth =  Buffer.from('Statusmonitor:db41f2598fc1ecd2e407f3d8ce59fe78').toString("base64");
        const postData = {"env": env};
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
            if(!res) {
                console.error(`response ist leer. event: ${ev} env: ${env}`);
                return;
            }


            let json = JSON.stringify(res.body);
            let data = JSON.parse(json);
            let event = json.substring(4,json.indexOf('&'));
            let room = JSON.parse(res.body).env;
    
            if(event){
                if (room) {
                    io.to(room).emit(event, data);
                } else {
                    console.error(`room: ${event} konnte nicht finden. event: ${event} env: ${env}`);
                    io.emit(event,data);
                }
            }
        });
    }
}
