const mongoose = require("mongoose");

const publisherSchema = new mongoose.Schema({
    publisher_name: String
});

module.exports = mongoose.model("Publishers", publisherSchema);