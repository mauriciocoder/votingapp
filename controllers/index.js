var express = require("express");
var router = express.Router();
module.exports = function(passport) {
    router.get("/works", function(req, res) {
        // Display the Login page with any flash message, if any
        res.end("it works!");
    });
    
    router.use("/login", require("./login")(passport));
    router.use("/register", require("./register")(passport));
    
    return router;
}
