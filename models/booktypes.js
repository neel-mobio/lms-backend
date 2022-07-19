const mongoose = require("mongoose");

const bookTypeSchema = new mongoose.Schema({
    book_type: String
});

module.exports = mongoose.model("BookTypes", bookTypeSchema);