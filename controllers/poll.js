var express = require("express");
var router = express.Router();
var Poll = require("../models/poll");
var Answer = require("../models/answer");

module.exports = function() {
    /* Handle polls GET */
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
    Answer.aggregate([
    { $match: { pollId: { $eq: poll[0]._id } } },
    { $group: { _id: "$value", count: { $sum: 1 } } }
    ], function(err, answers) {
        if (err) {
            console.log("error " + err);
            throw err;
        }
        var answerStats = [["Answer", "Total"]];
        for (var i = 0; i < answers.length; i++) {
            var answerStat = [];
            answerStat[0] = answers[i]._id;
            answerStat[1] = answers[i].count;
            answerStats.push(answerStat);
        }
        resContent.answerStats = JSON.stringify(answerStats);
        res.render("poll", resContent);
    });
}
