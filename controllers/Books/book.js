const { validateBookData } = require('./bookHelper');
const ExcelJS = require('exceljs');
var path = require('path');
var mime = require('mime');
const fs = require('fs');
// const bcrypt = require("bcrypt");
const db = require("../../models/index");
const mongoose = require("mongoose");
const Books = db.Books;
const BookCirculations = db.BookCirculations;
const workbook = new ExcelJS.Workbook();

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
            return res.status(201).json({
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
        return res.status(400).json({ error: "Something went to wrong..." })
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
        return res.status(200).json({ bookData: updatedBookData })
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
        return res.status(400).json({ error: "Something went to wrong..." })
    }
}

exports.booklistExport = async (req, res) => {
    try {
        const books = await Books.find({
            $and: [
                { is_deleted: false }
            ],
        })
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Books Details');


        worksheet.columns = [

            { header: 'ID', key: '_id', width: 30 },
            { header: 'Book Name', key: 'book_name', width: 30 },
            { header: 'Book Author', key: 'book_author', width: 20 },
            { header: 'Book Available', key: 'book_available', width: 15 },
            { header: 'Published Date', key: 'published_date', width: 20 },
            { header: 'Book Discription', key: 'book_discription', width: 30 },
            { header: 'Book Rating', key: 'book_rating', width: 10 },
            { header: 'Cover Page', key: 'cover_page', width: 25 },
            { header: 'Language', key: 'language', width: 20 },
            { header: 'Awards', key: 'awards', width: 20 },
            { header: 'Category', key: 'category', width: 15 },
            { header: 'Is Deleted', key: 'is_deleted', width: 10 },
            { header: 'CreatedAt', key: 'createdAt', width: 15 },
            { header: 'UpdatedAt', key: 'updatedAt', width: 15 },
        ]

        worksheet.mergeCells('A1', 'N2');
        worksheet.getCell('A1').value = `Books Details Start Date:{startDate}` + ` To ` + ` End Date:{endDate}`
        worksheet.getRow(4).values = ['ID', 'Book Name', 'Book Author', 'Book Available', 'Published Date', 'Book Discription', 'Book Rating', 'Cover Page', 'Language', 'Awards', 'Category', 'Is Deleted', 'CreatedAt', 'UpdatedAt'];
        worksheet.getRow(4).eachCell((cell) => {
            cell.font = { bold: true }
        });
        books.map((data) => {
            worksheet.addRow({
                _id: data._id,
                book_name: data.book_name,
                book_author: data.book_author,
                book_available: data.book_available,
                published_date: data.published_date,
                book_discription: data.book_discription,
                book_rating: data.book_rating,
                cover_page: data.cover_page,
                language: data.language,
                awards: data.awards,
                category: data.category,
                is_deleted: data.is_deleted,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            })
        })
        let exceloutput = `Books Details` + `From{startDate}` + `TO{endDate}.xlsx`

        var filename = path.basename(exceloutput);
        var mimetype = mime.lookup(exceloutput);

        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type', mimetype);
        await workbook.xlsx.writeFile(exceloutput);

        return res.download(filename, (err) => {
            if (err) {
                fs.unlinkSync(exceloutput)
                console.log(err)
            }
            fs.unlinkSync(exceloutput)
        })

        // return res.status(200).json({ books: books })

    } catch (error) {
        return res.status(400).json({ error: "Something went to wrong..." })
    }
}

exports.bookCirculationExport = async (req, res) => {
    try {
        const bookCirculation = await BookCirculations.find();

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('BookCirculations Details');

        worksheet.columns = [

            { header: 'ID', key: '_id', width: 30 },
            { header: 'Book Id', key: 'book_id', width: 30 },
            { header: 'Book Issuer', key: 'book_issuer', width: 20 },
            { header: 'Book Language', key: 'book_language', width: 15 },
            { header: 'Book Name', key: 'book_name', width: 30 },
            { header: 'Book Returner', key: 'book_returner', width: 15 },
            { header: 'Issue Date', key: 'issue_date', width: 15 },
            { header: 'Return Date', key: 'return_date', width: 25 },
            { header: 'Return Due Date', key: 'return_due_date', width: 20 },
            { header: 'Status', key: 'status', width: 10 },
            { header: 'CreatedAt', key: 'createdAt', width: 15 },
            { header: 'UpdatedAt', key: 'updatedAt', width: 15 },
        ]

        worksheet.mergeCells('A1', 'L2');
        worksheet.getCell('A1').value = `Book Circulations Details Start Date:{startDate}` + ` To ` + ` End Date:{endDate}`
        worksheet.getRow(4).values = ['ID', 'Book Id', 'Book Issuer', 'Book Language', 'Book Name', 'Book Returner', 'Issue Date', 'Return Date', 'Return Due Date', 'Status', 'CreatedAt', 'UpdatedAt'];
        worksheet.getRow(4).eachCell((cell) => {
            cell.font = { bold: true }
        });
        bookCirculation.map((data)=>{
            worksheet.addRow({
                _id: data._id,
                book_id: data.book_id,
                book_issuer: data.book_issuer,
                book_language: data.book_language,
                book_name: data.book_name,
                book_returner: data.book_returner,
                issue_date: data.issue_date,
                return_date: data.return_date,
                return_due_date: data.return_due_date,
                status: data.status,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            })
        })
        let exceloutput = `BookCirculations Details` + `From{startDate}` + `TO{endDate}.xlsx`

        var filename = path.basename(exceloutput);
        var mimetype = mime.lookup(exceloutput);

        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type', mimetype);
        await workbook.xlsx.writeFile(exceloutput);

        return res.download(filename, (err) => {
            if (err) {
                fs.unlinkSync(exceloutput)
                console.log(err)
            }
            fs.unlinkSync(exceloutput)
        })


    } catch (error) {

    }
}