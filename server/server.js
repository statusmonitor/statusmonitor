const express = require('express');
const bodyParser = require('body-parser');
const PORT = require('./config/config').port;
const app = express();
const cors = require('cors');
const api = require('./routes/api').router;
const user = require('./routes/user').router;
const weblogin = require('./routes/webLogin').router;
const http = require('http');
const config = require('./config/config');
const session = require('express-session');
const socketAPI = require('./socket').socketAPI;
process.title = config.title;
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

let server = http.createServer(app).listen(PORT,()=>{
    console.log('Monitor server is running on localhost ' + PORT);
}) ;

socketAPI(server);
module.exports.server = server;
