const mongoose = require('mongoose');
const { validateBookTypeData } = require('./bookTypesHelper');
const db = require("../../models/index");
const BookTypes = db.BookTypes;

exports.newBookType = async (req, res) => {
    const data = req.body;
    const { valid, errors } = validateBookTypeData(data);
    try {
        if (!valid) {
            return res.status(400).json({
                errors,
            });
        } else {
            const booktype = new BookTypes({
                _id: new mongoose.Types.ObjectId(),
                book_type: data.bookType
            });
            booktype.save()
                .then(async (result) => {
                    await result
                        .save()
                })
                .catch((err) => {
                    console.log(err)
                    res.status(500).json({
                        message: err.toString()
                    })
                });
            return res.status(201).json({
                message: "Book Type is created...!!",
            });
        }
    } catch (error) {
        return res.status(400).json({ errors: "something want to worng" });
    }
};

exports.listBookType = async (req, res) => {
    try {
        const bookTypes = await BookTypes.find()
        return res.status(200).json({ bookTypes: bookTypes })
    } catch (error) {
        return res.status(400).json({ error: "Something want to wrong..." })
    }
};

exports.bookTypeDetails = async (req, res) => {
    try {
        const errors = [];
        const id = req.params.bookType_id;
        const bookTypeData = await BookTypes.findById(id);
        if (bookTypeData === undefined) {
            errors.push({ msg: "Book Type data not found...!!" });
            return res.status(403).json({
                errors
            })
        }
        return res.status(200).json({ bookTypeData: bookTypeData });
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.message });
        return res.status(400).json(error);
    }
};

exports.updateBookTypeDetails = async (req, res) => {
    try {
        const id = req.params.bookType_id;
        const data = req.body;
        const { valid, errors } = validateBookTypeData(data);
        if (!valid) {
            return res.status(400).json({
                errors
            });
        }
        await BookTypes.findByIdAndUpdate(id,
            {
                $set: {
                    book_type: data.bookType,
                }
            },
        )
        const updatedBookTypeData = await BookTypes.findById(id)
        return res.status(200).json({ bookTypeData: updatedBookTypeData })
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.code });
        return res.status(400).json({ error })
    }
};

exports.bookTypeRemove = async (req, res) => {
    try {
        const id = req.params.bookType_id;
        const bookTypeRemoved = await BookTypes.findByIdAndRemove({ _id: id });
        if (bookTypeRemoved) {
            return res.status(200).json("Book Type deleted...");
        } else {
            return res.status(400).json("Book Type is not available")
        }
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.message });
        return res.status(400).json(error);
    }
};