const mongoose = require("mongoose");

const bookLanguageSchema = new mongoose.Schema({
    book_language: String,
    language_code: String
});

module.exports = mongoose.model("BookLanguages", bookLanguageSchema);