var express = require("express");
var router = express.Router();
var Answer = require("../models/answer");

module.exports = function() {
    /* Handle answer POST */
    router.post("/", function(req, res) {
        var possibleAnswers = req.body.answers.split(",");
        var userAnswer = req.body.answer;
        var _answerExists = answerExists(userAnswer, possibleAnswers);
        if (!req.isAuthenticated()) {
            var pollId = req.body.pollId;
            if (!_answerExists) {
                req.flash("message", "You must be logged in to create a new answer");
                res.redirect("/poll/" + pollId);
                return;
            }
        }
        saveAnswerAndRedirect(req, res);
    });
    return router;
};

function saveAnswerAndRedirect(req, res) {
    var answer = new Answer();
    answer.pollId = req.body.pollId;
    answer.value = req.body.answer;
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    answer.user = req.isAuthenticated() ? req.user._id : ip;
    Answer.findOne({user: answer.user, pollId: answer.pollId}, function(err, _answer) {
        if (_answer) {
            req.flash("message", "User has already answered");
            res.redirect("/poll/" + answer.pollId);
        } else {
            answer.save(function(err) {
                if (err) {
                    console.log("Error saving answer " + err);
                    throw err;
                }
                // TODO: Save if it is a new answer
                req.flash("message", "Answer registered with success!");
                res.redirect("/poll/" + answer.pollId);
            });
        }
    });
}

function answerExists(userAnswer, possibleAnswers) {
    var _answerExists = false;
    for (var i = 0; i < possibleAnswers.length; i++) {
        _answerExists |= (userAnswer === possibleAnswers[i]);
    }
    return _answerExists;
}
