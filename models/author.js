const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
    author_firstName:String,
    author_lastName:String,
    description:String
})

module.exports = mongoose.model("Authors",authorSchema);