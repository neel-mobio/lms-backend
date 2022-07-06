const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    book_name: String,
    book_auther: String,
    book_available: Boolean,
    published_date: Date,
    book_discription: String,
    book_rating: Number,
    cover_page: String,
    language: String,
    awards: String,
    book_price: String,
    library_name: String,
    no_of_book: Number,
    book_format: String,
    book_edition: String,
    // characters:data,
    category: String,
    // created_at: new Date(),
    is_deleted: Boolean
},
{
    timestamps : true
}
);

module.exports = mongoose.model("Books",bookSchema);