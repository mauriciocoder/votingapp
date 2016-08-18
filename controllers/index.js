var express = require("express");
var router = express.Router();
module.exports = function(passport) {
    router.get("/", function(req, res) {
        res.render("polls", { user: req.user, authenticated: req.isAuthenticated() });
    });
    
    router.use("/login", require("./login")(passport));
    router.use("/register", require("./register")(passport));
    
    /* Handle Logout */
	router.get("/logout", function(req, res) {
		req.logout();
		res.redirect('/');
	});
    
    return router;
}
