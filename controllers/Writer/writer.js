const { validateWriterData } = require('./writerHelper');
const mongoose = require('mongoose');
const db = require("../../models/index");
const Writers = db.Writers;


exports.newWriter = async (req, res) => {
    const data = req.body;
    const { valid, errors } = validateWriterData(data);
    try {
        if (!valid) {
            return res.status(400).json({
                errors,
            });
        } else {
            const writer = new Writers({
                _id: new mongoose.Types.ObjectId(),
                writer_firstName: data.firstName,
                writer_lastName: data.lastName,
                description: data.description,
            });
            writer.save()
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
                message: "Writer is created...!!",
            });
        }
    } catch (error) {
        return res.status(400).json({ errors: "something want to worng" });
    }
};

exports.listWriter = async (req, res) => {
    try {
        const writers = await Writers.find()
        return res.status(200).json({ writers: writers })
    } catch (error) {
        return res.status(400).json({ error: "Something went to wrong..." })
    }
};

exports.writerDetails = async (req, res) => {
    try {
        const errors = [];
        const id = req.params.writer_id;
        const writerData = await Writers.findById(id);
        if (writerData === undefined) {
            errors.push({ msg: "Writer data not found...!!" });
            return res.status(403).json({
                errors
            })
        }
        return res.status(200).json({ writerData: writerData });
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.message });
        return res.status(400).json(error);
    }
};

exports.updateWriterDetails = async (req, res) => {
    try {
        const id = req.params.writer_id;
        const data = req.body;
        const { valid, errors } = validateWriterData(data);
        if (!valid) {
            return res.status(400).json({
                errors
            });
        }
        await Writers.findByIdAndUpdate(id,
            {
                $set: {
                    writer_firstName: data.firstName,
                    writer_lastName: data.lastName,
                    description: data.description,
                }
            },
        )
        const updatedWriterData = await Writers.findById(id)
        return res.status(200).json({ writerData: updatedWriterData })
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.code });
        return res.status(400).json({ error })
    }
};

exports.writerRemove = async (req, res) => {
    try {
        const id = req.params.writer_id;
        const writerRemoved = await Writers.findByIdAndRemove({ _id: id });
        if (writerRemoved) {
            return res.status(200).json("Writer deleted...");
        } else {
            return res.status(400).json("Writer is not available")
        }
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.message });
        return res.status(400).json(error);
    }
};