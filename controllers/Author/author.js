const db = require("../../models/index");
const mongoose = require("mongoose");
const { validateAuthorData } = require('./authorHelper');
const Authors = db.Authors;

exports.newAuthor = async (req, res) => {
    const data = req.body;
    const { valid, errors } = validateAuthorData(data);
    try {
        if (!valid) {
            return res.status(400).json({
                errors,
            });
        } else {
            const author = new Authors({
                _id: new mongoose.Types.ObjectId(),
                author_firstName: data.firstName,
                author_lastName: data.lastName,
                description: data.description,
            });
            author.save()
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
            return res.status(200).json({
                message: "Author is created...!!",
            });
        }
    } catch (error) {
        return res.status(400).json({ errors: "something want to worng" });
    }
};

exports.listAuthor = async (req, res) => {
    try {
        const authors = await Authors.find()
        return res.status(200).json({ authors: authors })
    } catch (error) {
        return res.status(400).json({ error: "Something want to wrong..." })
    }
};

exports.authorDetails = async (req, res) => {
    try {
        const errors = [];
        const id = req.params.author_id;
        const authorData = await Authors.findById(id);
        if (authorData === undefined) {
            errors.push({ msg: "Author data not found...!!" });
            return res.status(403).json({
                errors
            })
        }
        return res.status(200).json({ authorData: authorData });
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.message });
        return res.status(400).json(error);
    }
};

exports.updateAuthorDetails = async (req, res) => {
    try {
        const id = req.params.author_id;
        const data = req.body;
        const { valid, errors } = validateAuthorData(data);
        if (!valid) {
            return res.status(400).json({
                errors
            });
        }
        await Authors.findByIdAndUpdate(id,
            {
                $set: {
                    author_firstName: data.firstName,
                    author_lastName: data.lastName,
                    description: data.description,
                }
            },
        )
        const updatedAuthorData = await Authors.findById(id)
        return res.status(201).json({ authorData: updatedAuthorData })
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.code });
        return res.status(400).json({ error })
    }
};

exports.authorRemove = async (req, res) => {
    try {
        const id = req.params.author_id;
        const authorRemoved = await Authors.findByIdAndRemove({ _id: id });
        if (authorRemoved) {
            return res.status(200).json("Author deleted...");
        } else {
            return res.status(400).json("Author is not available")
        }
        // return res.status(200).json("Author deleted...")
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.message });
        return res.status(400).json(error);
    }
};