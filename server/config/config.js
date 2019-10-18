let title = 'StatusMonitorNode';
let port = 3001;

let env = "dev";
let mule = {
    "service":"kontaktcenteradministration",
    "authorization":"Statusmonitor:db41f2598fc1ecd2e407f3d8ce59fe78",
    convertEnv: function(env){
        switch(env){
            case "dev" || "dev1" || "dev2":
                    return "dev";
                break;

            case "test" || "test1" || "test2":
                    return "test";
                break;

            case "live" || "live1" || "live2":
                    return "live";
                break;

            default :
                    return "dev";
                break;          
        }
    },
    selectEnv: function(env){

        let value;
        
        switch(env){

            case 'local':
                value = "http://localhost:8080/";
            break;

            case 'dev':
                value = "http://mule-dev.sw.buhl-data.com:8080/";
            break;

            case 'test1':
                value = "http://mule-test1.sw.buhl-data.com:8080/";
            break;

            case 'test2':
                value = "http://mule-test2.sw.buhl-data.com:8080/";
            break;

            case 'live1':
                value = "http://mule-1.sw.buhl-data.com:8080/";
            break;

            case 'live2':
                value = "http://mule-2.sw.buhl-data.com:8080/";
            break;

            default:
                value = "http://localhost:8080/";
            break;  

        }
        return value;
    }
};

let weblogin = {
    weblogin:{
        "server": "http://weblogin.sw.buhl-data.com",
        "service": 60,
        "service_local": 61,
        "secret" : "fsfo3SbeaOSvm30G4md4fvDS2s45"
    },
    redirect:{
        "page": "http://linux-entwicklung.sw.buhl-data.com:4200/loginSuccess",
        "pageLocal": "http://localhost:4200/loginSuccess"
    },
    allowedAuth: 'root'
  };

module.exports = {
    title:title,
    env : env,
    weblogin : weblogin,
    mule : mule,
    port : port    
}

