var express = require("express");
var router = express.Router();
var Poll = require("../models/poll");

module.exports = function() {
    /* Handle polls GET */
    router.get("/", function(req, res) {
        console.log("chegou no polls");
        Poll.find({}, handlePollsView.bind(null, req, res));
    });
    return router;
};

function handlePollsView(req, res, err, polls) {
    var resContent = { user: req.user, authenticated: req.isAuthenticated() };
    var userPolls = [];
    var allPolls = [];
    if (resContent.authenticated) {
        for (var i = 0; i < polls.length; i++) {
            if (polls[i].author == resContent.user.id) {
                userPolls.push(polls[i]);
            } else {
                allPolls.push(polls[i]);
            }
        }
    } else {
        allPolls = polls;
    }
    resContent.userPolls = userPolls;
    resContent.allPolls = allPolls;
    res.render("polls", resContent);
}
