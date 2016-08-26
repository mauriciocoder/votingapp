var express = require("express");
var router = express.Router();
var Answer = require("../models/answer");

module.exports = function() {
    /* Handle answer POST */
    router.post("/", function(req, res) {
        if (!req.isAuthenticated()) {
            var possibleAnswers = req.body.answers.split(",");
            var userAnswer = req.body.answer;
            var pollId = req.body.pollId;
            var isAnswerValid = checkUserAnswer(userAnswer, possibleAnswers);
            if (!isAnswerValid) {
                req.flash("message", "You must be logged in to create a new answer");
                res.redirect("/poll/" + pollId);
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
    answer.user = "?";
    answer.save(function(err) {
        if (err) {
            console.log("Error saving answer " + err);
            throw err;
        }
        req.flash("message", "Answer registered with success!");
        res.redirect("/poll/" + answer.pollId);
    });
}

function checkUserAnswer(userAnswer, possibleAnswers) {
    var answerExists = false;
    for (var i = 0; i < possibleAnswers.length; i++) {
        answerExists |= (userAnswer === possibleAnswers[i]);
    }
    return answerExists;
}
