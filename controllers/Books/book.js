const { validateBookData } = require('./bookHelper');
// const bcrypt = require("bcrypt");
const db = require("../../models/index");
const mongoose = require("mongoose");
const Books = db.Books;
const BookCirculations = db.BookCirculations;

exports.newBook = async (req, res) => {
    const data = req.body
    const { valid, errors } = validateBookData(data);
    try {
        if (!valid) {
            return res.status(400).json({
                errors,
            });
        } else {
            const book = new Books({
                _id: new mongoose.Types.ObjectId(),
                book_name: data.name,
                book_author: data.author,
                book_available: true,
                published_date: data.publishedDate,
                book_discription: data.discription,
                book_rating: data.rating,
                cover_page: data.coverPage,
                language: data.language,
                awards: data.awards,
                book_price: data.price,
                library_name: data.library,
                no_of_book: data.numberOfBook,
                book_format: data.format,
                book_edition: data.edition,
                // characters:data,
                category: data.category,
                created_at: new Date(),
                is_deleted: false
                // user_deposit: data?.deposit || 2000,
                // created_at: new Date(),
            });
            book
                .save()
                .then(async (result) => {
                    await result
                        .save()
                    // .then((result1) => {
                    //     console.log(`Book created ${result}`)
                    //     console.log(`Book created1111 ${result1}`)
                    //     res.status(201).json({
                    //         bookDetails: {
                    //             result1
                    //         },
                    //     })
                    // })
                    // .catch((err) => {
                    //     console.log(err)
                    //     res.status(400).json({
                    //         message: err.toString()
                    //     })
                    // });
                })
                .catch((err) => {
                    console.log(err)
                    res.status(500).json({
                        message: err.toString()
                    })
                });
            return res.status(200).json({
                message: "Book is created...!!",
            });
        }
    } catch (error) {
        return res.status(400).json({ errors: "something want to worng" });
    }
}

exports.listBooks = async (req, res) => {
    try {
        const books = await Books.find({
            $and: [
                { is_deleted: false }
            ],
        })
        return res.status(200).json({ books: books })

    } catch (error) {
        return res.status(400).json({ error: "Something want to wrong..." })
    }
}

exports.bookDetails = async (req, res) => {
    try {
        const errors = [];
        const id = req.params.book_id;
        const bookData = await Books.findById(id);
        if (bookData === undefined) {
            errors.push({ msg: "Book data not found...!!" });
            return res.status(403).json({
                errors
            })
        }
        return res.status(200).json({ bookData: bookData });
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.message });
        return res.status(400).json(error);
    }
}

exports.updateBookDetails = async (req, res) => {
    try {
        const id = req.params.book_id;
        const data = req.body;
        const { valid, errors } = validateBookData(data);
        if (!valid) {
            return res.status(400).json({
                errors
            });
        }
        await Books.findByIdAndUpdate(id,
            {
                $set: {
                    book_name: data.name,
                    book_author: data.author,
                    published_date: data.publishedDate,
                    book_discription: data.discription,
                    book_rating: data.rating,
                    cover_page: data.coverPage,
                    language: data.language,
                    awards: data.awards,
                    // characters:data,
                    category: data.category,
                }
            },
        )
        const updatedBookData = await Books.findById(id)
        return res.status(201).json({ bookData: updatedBookData })
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.code });
        return res.status(400).json({ error })
    }

}

exports.bookRemove = async (req, res) => {
    try {
        const id = req.params.book_id;
        const bookremoved = await Books.findByIdAndRemove({ _id: id })
        if (bookremoved) {
            return res.status(200).json("Book deleted...");
        } else {
            return res.status(400).json("Book is not available")
        }
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.message });
        return res.status(400).json(error);
    }
}

exports.bookCirculation = async (req, res) => {
    try {
        const bookCirculation = await BookCirculations.find();
        return res.status(200).json({ bookCirculation: bookCirculation })

    } catch (error) {
        return res.status(400).json({ error: "Something want to wrong..." })
    }
}