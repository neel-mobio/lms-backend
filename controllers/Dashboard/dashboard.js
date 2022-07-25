const mongoose = require("mongoose");
const { BookCirculations } = require("../../models/index");
const db = require("../../models/index");
const Books = db.Books;
const Users = db.Users;

exports.dashboardCount = async (req, res) => {
    try {
        const books = await Books.find({
            $and: [
                { is_deleted: false }
            ],
        }).count();
        const users = await Users.find({
            $and: [
                { user_type: "member" }
            ],
        }).count();
        const issuedBooks = await Books.find({
            $and: [
                { book_available: false }
            ],
        }).count();
        const dueBooks = await Books.find({
            $and: [
                { is_deleted: false && { book_available: true } }
            ],
        }).count();
        const overdueBook = await BookCirculations.find({
            "return_due_date": { $lt: new Date() }
        }).count();
        const bookCirculations = await BookCirculations.find().limit(5);
        const bookType = await Books.find({},{_id:0,category:1});
        
        let [bookCount, userCount, issuedBooksCount, dueBooksCount, overdueBookCount, bookCirculation, bookTypes] = await Promise.allSettled([books, users, issuedBooks, dueBooks, overdueBook, bookCirculations, bookType]);

        return res.status(200).json({ booksCount: bookCount, membersCount: userCount, issuedBooksCount: issuedBooksCount, dueBooksCount: dueBooksCount, overdueBookCount: overdueBookCount, bookCirculations: bookCirculation, bookTypes: bookTypes })
    } catch (error) {
        return res.status(400).json({ error: "something went to wrong..." });
    }
}