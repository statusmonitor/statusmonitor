const express = require('express');
const bodyParser = require('body-parser');
const PORT = require('./config/config').port;
const app = express();
const cors = require('cors');
const api = require('./routes/api').router;
const user = require('./routes/user').router;
const weblogin = require('./routes/webLogin').router;
const mule = require('./modules/mule');
const fetch = require('./modules/fetch');
const http = require('http');
const socketIO = require("socket.io");
const config = require('./config/config');
const session = require('express-session');
//const auth = require('./lib/auth');

app.use(cors());
app.use(bodyParser.json());
app.use(session({ 
    secret: config.weblogin.weblogin.secret,
    resave: false,
    saveUninitialized: true
  }))

app.post('/event/*',api);
app.get('/weblogin/*',weblogin);
app.get('/user/*',user);

let clients = {};
let client = {id:"",room:"",user:""};

let server = http.createServer(app).listen(PORT,()=>{
    console.log('Monitor server is running on localhost ' + PORT);
}) ;

let io = socketIO(server);
fetch.io(io);

io.on("connection",((so)=>{ 
    so.on("disconnect",()=>{
        io.emit('delUserInfo',so.id);
       // console.log(`${clients[so.id].user} : disconnected`);
        delete clients[so.id];
    });

    so.on('init',(data)=>{
        client = new Object();
        let id = so.id;
        let room = data["env"];
        let user = data["user"];

        client.id = id;
        clients[id] = client;
        clients[id].room = room;
        clients[id].user = user;
        console.log(`${user} : connected`);

        io.emit('saveUserInfo',{'user':clients,'id':id});
        //io.emit('update',"dev");
        fetch.fetch('Statusmonitor_getAllServerStatus',room,"callAllServerState");
        fetch.fetch('Statusmonitor_getMuleErrorList',room,"callErrorList");
        so.join(room);
    }); 
 
    so.on('mule',(data)=>{
        let call = data["event"];
        let sockID = data["socketID"];
        let env = data["env"];
        mule(data,call,(result)=>{
            io.to(sockID).emit('message',result);
            fetch.fetch('Statusmonitor_getMuleErrorList',env,"callErrorList");
        }); 
    });

    so.on('update',(data)=>{
        clients[data["socketID"]].room = data["newenv"];
        let env = data["newenv"];
        let oldEnv=data["oldenv"];
        let user = data["user"];

        checkAuth(so,oldEnv,env,user);
        io.emit('saveUserInfo',{'user':clients,'id':data["socketID"]});
    });
}));

function getAuth(env,user){
    let getRights = "kontaktcenteradministration/Rights_getMyRights";
    let _obj = {
        "user_ldap": user,
        "env": env
    };
    let authlist = mule.getUserData(_obj,getRights,config.env);
    return authlist;
}

async function checkAuth(so,oldEnv,env,user){
    
    let rights = {};
    rights = await getAuth(env,user);
    //let chk =  auth.hasAuth(rights);
    updateEnv(so,oldEnv, env);

    // if(chk){
    //     updateEnv(so,oldEnv, env);
    // } 
    // else{
    //     console.log("not allowed user :" + env);
    // } 
}

function updateEnv(so,oldEnv,env){
    so.leave(oldEnv);
    so.join(env);
    fetch.fetch('Statusmonitor_getAllServerStatus',env,"callAllServerState");
    fetch.fetch('Statusmonitor_getMuleErrorList',env,"callErrorList");
    fetch.fetch('Statusmonitor_getMyState',env,"CallMuleState");
}
