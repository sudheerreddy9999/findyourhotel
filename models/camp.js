var mongoose = require("mongoose");
var hotel_schema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    location: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }

});
module.exports = mongoose.model("Hotel", hotel_schema);