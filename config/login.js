var bCrypt = require("bcrypt-nodejs");
var LocalStrategy   = require("passport-local").Strategy;
var User = require("../models/user");

module.exports = function(passport) {
    // For login
	passport.use("login", new LocalStrategy(
	    { passReqToCallback : true },
	    function(req, username, password, done) {
	        console.log("LocalStrategy hit!");
	        User.findOne(
	            { "username" : username },
	            function(err, user) {
	                if (err) {
	                    return done(err);
	                }
	                if (!user) {
	                    console.log("User not found with username " + username);
	                    return done(null, false, req.flash("message", "User not found"));
	                }
	                if (!isValidPassword(user, password)) {
	                    console.log("Invalid Password!");
	                    return done(null, false, req.flash("message", "Invalid Password"));
	                }
	                return done(null, user);
	            }
	        )
	    }
	));
	
	var isValidPassword = function(user, password) {
        return bCrypt.compareSync(password, user.password);
    }
};