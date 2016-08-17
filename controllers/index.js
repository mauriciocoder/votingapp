var express = require("express");
var router = express.Router();
module.exports = function(passport) {
    /* GET login page. */
    router.get("/", function(req, res) {
        // Display the Login page with any flash message, if any
        res.render("login", { message: req.flash('message') });
        //res.render("index", { test: "adaba" });
    });
    
    router.get("/works", function(req, res) {
        // Display the Login page with any flash message, if any
        res.end("it works!");
        //res.render("index", { test: "adaba" });
    });
    
    router.use("/login", require("./login")(passport));
    
    return router;
}
