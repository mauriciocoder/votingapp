var express = require("express");
var router = express.Router();
var Poll = require("../models/poll");

module.exports = function() {
    /* Handle polls GET */
    router.get("/:ID", function(req, res) {
        var pollId = req.params.ID;
        Poll.find({_id : pollId}, handlePollView.bind(null, req, res));
    });
    return router;
};

function handlePollView(req, res, err, poll) {
    console.log("poll = " + poll);
    var resContent = { user: req.user, authenticated: req.isAuthenticated() };
    resContent.poll = poll;
    resContent.message = req.flash("message");
    res.render("poll", resContent);
}
