const config = require('../config/config');

module.exports = {
    isLogined: function(req,res){
        if(req.session.is_logined) return true;
        else return false;
    },
    hasAuth: function(rights){
        if(!rights) return false;
        if(rights.includes(config.weblogin.allowedAuth)) return true;
        else return false;
    }
}
