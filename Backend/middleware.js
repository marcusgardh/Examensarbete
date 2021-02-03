const jwt = require("jsonwebtoken");
const config = require("./config/config");

// verifyToken looks to see if user is logged in or not and returns error accordingly
const verifyToken = function(req, res, next) {
    let token = req.cookies.token;

    if (!token) {
        return res.status(403).send({isToken: false, message: "Unauthorized: No token provided"});
    };
    
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
            return res.status(401).send({isToken: false, message: "Unauthorized: Invalid token"});
        } 
        
        req.email = decoded.email;
        
        next();
        
    });
    
}

module.exports = verifyToken;