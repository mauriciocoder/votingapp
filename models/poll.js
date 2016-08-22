var mongoose = require("mongoose");
var Schema = mongoose.Schema;
module.exports = mongoose.model("Poll", {
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    question: String,
    answers: [String]
});