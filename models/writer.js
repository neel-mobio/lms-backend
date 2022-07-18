const mongoose = require("mongoose");

const writerSchema = new mongoose.Schema({
    writer_firstName: String,
    writer_lastName: String,
    description: String
});

module.exports = mongoose.model("Writers", writerSchema);