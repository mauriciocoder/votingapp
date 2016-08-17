var express = require("express");
var router = express.Router();
module.exports = function(passport) {
    /* Handle Login POST */
    router.post("/", passport.authenticate('login', {
        successRedirect: '/works',
        failureRedirect: '/',
        failureFlash : true  
    }));
    
    return router;
};
