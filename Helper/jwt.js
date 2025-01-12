var{expressjwt:jwt} = require('express-jwt');
require('dotenv/config');

function authjwt(){
    const secret = process.env.JWT_WEB_TOKEN;
    return jwt({secret:secret,algorithms : ["HS256"]})
}

module.exports=authjwt