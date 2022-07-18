const db = require("../../models/index");
const mongoose = require("mongoose");
const {validatePublisherData} = require('./publisherHelper');
const Publishers = db.Publishers;

exports.newPublisher = async (req, res) => {
    const data = req.body;
    const { valid, errors } = validatePublisherData(data);
    try {
        if (!valid) {
            return res.status(400).json({
                errors,
            });
        } else {
            const publisher = new Publishers({
                _id: new mongoose.Types.ObjectId(),
                publisher_name:data.publisherName
            });
            publisher.save()
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
                message: "Publisher is created...!!",
            });
        }
    } catch (error) {
        return res.status(400).json({ errors: "something want to worng" });
    }
};

exports.listPublisher = async (req, res) => {
    try {
        const publishers = await Publishers.find()
        return res.status(200).json({ publishers: publishers })
    } catch (error) {
        return res.status(400).json({ error: "Something want to wrong..." })
    }
};

exports.publisherDetails = async (req, res) => {
    try {
        const errors = [];
        const id = req.params.publisher_id;
        const publisherData = await Publishers.findById(id);
        if (publisherData === undefined) {
            errors.push({ msg: "Publisher data not found...!!" });
            return res.status(403).json({
                errors
            })
        }
        return res.status(200).json({ publisherData: publisherData });
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.message });
        return res.status(400).json(error);
    }
};

exports.updatePublisherDetails = async (req, res) => {
    try {
        const id = req.params.publisher_id;
        const data = req.body;
        const { valid, errors } = validatePublisherData(data);
        if (!valid) {
            return res.status(400).json({
                errors
            });
        }
        await Publishers.findByIdAndUpdate(id,
            {
                $set: {
                    publisher_name: data.publisherName,
                }
            },
        )
        const updatedPublisherData = await Publishers.findById(id)
        return res.status(200).json({ publisherData: updatedPublisherData })
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.code });
        return res.status(400).json({ error })
    }
};

exports.publisherRemove = async (req, res) => {
    try {
        const id = req.params.publisher_id;
        const publisherRemoved = await Publishers.findByIdAndRemove({ _id: id });
        if (publisherRemoved) {
            return res.status(200).json("Publisher deleted...");
        } else {
            return res.status(400).json("Publisher is not available")
        }
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.message });
        return res.status(400).json(error);
    }
};