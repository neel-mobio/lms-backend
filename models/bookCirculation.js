const mongoose = require("mongoose");

const BookCirculationsSchema = new mongoose.Schema({
    book_code: String,
    book_edition: String,
    book_id: String,
    book_issuer: String,
    book_language: String,
    book_name: String,
    book_returner: String,
    book_format: String,
    issue_date: Date,
    member: String,
    return_date: Date,
    return_due_date: Date,
    status: Boolean
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("BookCirculations", BookCirculationsSchema );