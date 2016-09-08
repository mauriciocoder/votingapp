var express = require("express");
var router = express.Router();
var Poll = require("../models/poll");
var Answer = require("../models/answer");

module.exports = function() {
    /* Handle poll DELETE */
    router.post("/delete", function(req, res) {
        Answer.remove({ pollId: req.body.pollId }, function(err) {
            Poll.remove({ _id: req.body.pollId }, function(err) {
                req.flash("message", "Poll deleted with success!");
                res.redirect("/polls");
            });
        });
    });
    
    /* Handle new poll GET */
    router.get("/new", function(req, res) {
        var resContent = { user: req.user, authenticated: req.isAuthenticated() };
        res.render("pollnew", resContent);
    });
    
    /* Handle new poll POST */
    router.post("/new", function(req, res) {
        var author = req.user._id;
        var question = req.body.question;
        var answers = req.body.answers;
        console.log("author = " + author);
        console.log("question = " + question);
        console.log("answers = " + answers);
        var poll = new Poll();
        poll.author = author;
        poll.question = question;
        poll.answers = answers.split("|");
        poll.save(function(err) {
            if (err) {
                throw err;
            } else {
                req.flash("message", "Poll created with success!");
                res.redirect("/polls");
            }
        });
    });
    
    /* Handle poll GET */
    router.get("/:ID", function(req, res) {
        var pollId = req.params.ID;
        Poll.find({_id : pollId}, handlePollView.bind(null, req, res));
    });
    
    return router;
};

function handlePollView(req, res, err, poll) {
    var resContent = { user: req.user, authenticated: req.isAuthenticated() };
    resContent.poll = poll;
    resContent.shareUrl = req.protocol + '://' + req.get("host") + req.originalUrl;
    resContent.message = req.flash("message");
    resContent.isAuthor = req.isAuthenticated() ? JSON.stringify(req.user._id) == JSON.stringify(poll[0].author) : false;
    // For answer stats
    Answer.aggregate([
    { $match: { pollId: { $eq: poll[0]._id } } },
    { $group: { _id: "$value", count: { $sum: 1 } } }
    ], function(err, answers) {
        if (err) {
            console.log("error " + err);
            throw err;
        }
        resContent.answerStats = loadAnswerStats(answers);
        res.render("poll", resContent);
    });
}

function loadAnswerStats(answers) {
    var answerStats = [["Answer", "Total"]];
    for (var i = 0; i < answers.length; i++) {
        var answerStat = [];
        answerStat[0] = answers[i]._id;
        answerStat[1] = answers[i].count;
        answerStats.push(answerStat);
    }
    return JSON.stringify(answerStats);
}
