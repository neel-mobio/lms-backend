const mongoose = require('mongoose');
const { validateBookLanguageData } = require('./bookLanguagesHelper');
const db = require("../../models/index");
const BookLanguages = db.BookLanguages;

exports.newBookLanguage = async (req, res) => {
    const data = req.body;
    const { valid, errors } = validateBookLanguageData(data);
    try {
        if (!valid) {
            return res.status(400).json({
                errors,
            });
        } else {
            const booklanguage = new BookLanguages({
                _id: new mongoose.Types.ObjectId(),
                book_language: data.bookLanguage,
                language_code: data.languageCode
            });
            booklanguage.save()
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
                message: "Language is created...!!",
            });
        }
    } catch (error) {
        return res.status(400).json({ errors: "something want to worng" });
    }
};

exports.listBookLanguage = async (req, res) => {
    try {
        const bookLanguages = await BookLanguages.find()
        return res.status(200).json({ bookLanguages: bookLanguages })
    } catch (error) {
        return res.status(400).json({ error: "Something went to wrong..." })
    }
};

exports.bookLanguageDetails = async (req, res) => {
    try {
        const errors = [];
        const id = req.params.language_id;
        const bookLanguageData = await BookLanguages.findById(id);
        if (bookLanguageData === undefined) {
            errors.push({ msg: "Book Language not found...!!" });
            return res.status(403).json({
                errors
            })
        }
        return res.status(200).json({ bookLanguageData: bookLanguageData });
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.message });
        return res.status(400).json(error);
    }
};

exports.updateBookLanguageDetails = async (req, res) => {
    try {
        const id = req.params.language_id;
        const data = req.body;
        const { valid, errors } = validateBookLanguageData(data);
        if (!valid) {
            return res.status(400).json({
                errors
            });
        }
        await BookLanguages.findByIdAndUpdate(id,
            {
                $set: {
                    book_language: data.bookLanguage,
                    language_code: data.languageCode
                }
            },
        )
        const updatedBookLanguageData = await BookLanguages.findById(id)
        return res.status(200).json({ bookLanguageData: updatedBookLanguageData })
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.code });
        return res.status(400).json({ error })
    }
};

exports.bookLanguageRemove = async (req, res) => {
    try {
        const id = req.params.language_id;
        const bookLanguageRemoved = await BookLanguages.findByIdAndRemove({ _id: id });
        if (bookLanguageRemoved) {
            return res.status(200).json("Book Language deleted...");
        } else {
            return res.status(400).json("Book Language is not available")
        }
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.message });
        return res.status(400).json(error);
    }
};