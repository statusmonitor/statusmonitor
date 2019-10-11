const socketIO = require("socket.io");
const auth = require('./lib/auth');
const mule = require('./modules/mule');
const fetch = require('./modules/fetch');
const config = require('./config/config');

let clients = {};

module.exports.socketAPI = function(server){
    let io = socketIO(server);
    fetch.io(io);
    events(io);
}

function events(io){
    io.on("connection",((so)=>{
        
        so.on("disconnect",()=>{
            delClient(so.id);
        });
        so.on('getIDFromServer',()=>{
            io.emit('init',so.id);
        }); 
        so.on('initUserToServer',(data)=>{
            initUser(so,data["obj"],data["user"]);
        }); 
        so.on('updateEnv',(data)=>{
            updateEnv(so,data);
        });
    }));
        
    function delClient(id){
        io.emit('delUser',id);
        delete clients[id];
    }

    function initUser(so,option,client){
        let room = option["env"];
        let userName = option["user"];
        
        initClients(so.id,client);
        updateClients();
        fetchData(room);
        so.join(room);
        console.log(`${userName}:${room}  connected`);
    }

    function updateEnv(so,data){
        let userid = data["socketID"];
        let newEnv = data["newenv"];
        let oldEnv=data["oldenv"];
        let userName = data["user"];

        checkAuth(so,oldEnv,newEnv,userName);
        changeEnv_Client(userid,newEnv);
        updateClients();
    }
    
    async function checkAuth(so,oldEnv,env,user){
        changeEnv_server(so,oldEnv, env);
        //let rights = {};
        //rights = await getAuth(env,user);
        //let chk =  auth.hasAuth(rights);
        //updateEnv(so,oldEnv, env);
    
        // if(chk){
        //     updateEnv(so,oldEnv, env);
        // } 
        // else{
        //     console.log("not allowed user :" + env);
        // } 
    }
        
    function getAuth(env,user){
        let getRights = "kontaktcenteradministration/Rights_getMyRights";
        let _obj = {
            "user_ldap": user,//wrong user name
            "env": env
        };
        let authlist = mule.getUserData(_obj,getRights,config.env);
        return authlist;
    }
    
    function changeEnv_server(so,oldEnv,env){
        so.leave(oldEnv);
        so.join(env);
        fetchData(env);
    }
        
    function fetchData(env){ 
        fetch.fetch('Statusmonitor_getAllServerStatus',env);
        fetch.fetch('Statusmonitor_getMuleErrorList',env);
        fetch.fetch('Statusmonitor_getMyState',env);
    }

    function initClients(id,user){
        clients[id] = user;
    }

    function changeEnv_Client(userid,newEnv){
        clients[userid]["_room"] = newEnv;
    }

    function updateClient(client){
        io.emit('saveUser',{'user':client});
    }

    function updateClients(){
        io.emit('saveUsers',{clients});
    }

}



