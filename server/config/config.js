let title = 'StatusMonitorNode';
let port = 3001;

let env = "dev";
let muleUrl = {
    "local": "http://localhost:8080/",
    "dev": "http://mule-dev.sw.buhl-data.com:8080/",
    "test": "http://mule-test.sw.buhl-data.com:8080/",
    "live": "http://mule.sw.buhl-data.com:8080/"
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
    muleUrl : muleUrl,
    port : port    
}

