var mongoose = require("mongoose");
var Schema = mongoose.Schema;
module.exports = mongoose.model("Answer", {
    pollId: {type: Schema.Types.ObjectId, ref: "Poll"},
    value: String,
    user: String
});