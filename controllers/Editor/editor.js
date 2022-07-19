const db = require("../../models/index");
const mongoose = require("mongoose");
const { validateEditorData } = require('./editorHelper');
const Editors = db.Editors;

exports.newEditor = async (req, res) => {
    const data = req.body;
    const { valid, errors } = validateEditorData(data);
    try {
        if (!valid) {
            return res.status(400).json({
                errors,
            });
        } else {
            const editor = new Editors({
                _id: new mongoose.Types.ObjectId(),
                editor_name:data.editorName
            });
            editor.save()
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
                message: "Editor is created...!!",
            });
        }
    } catch (error) {
        return res.status(400).json({ errors: "something want to worng" });
    }
};

exports.listEditor = async (req, res) => {
    try {
        const editors = await Editors.find()
        return res.status(200).json({ editors: editors })
    } catch (error) {
        return res.status(400).json({ error: "Something want to wrong..." })
    }
};

exports.editorDetails = async (req, res) => {
    try {
        const errors = [];
        const id = req.params.editor_id;
        const editorData = await Editors.findById(id);
        if (editorData === undefined) {
            errors.push({ msg: "Editor data not found...!!" });
            return res.status(403).json({
                errors
            })
        }
        return res.status(200).json({ editorData: editorData });
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.message });
        return res.status(400).json(error);
    }
};

exports.updateEditorDetails = async (req, res) => {
    try {
        const id = req.params.editor_id;
        const data = req.body;
        const { valid, errors } = validateEditorData(data);
        if (!valid) {
            return res.status(400).json({
                errors
            });
        }
        await Editors.findByIdAndUpdate(id,
            {
                $set: {
                    editor_name: data.editorName,
                }
            },
        )
        const updatedEditorData = await Editors.findById(id)
        return res.status(200).json({ editorData: updatedEditorData })
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.code });
        return res.status(400).json({ error })
    }
};

exports.editorRemove = async (req, res) => {
    try {
        const id = req.params.editor_id;
        const editorRemoved = await Editors.findByIdAndRemove({ _id: id });
        if (editorRemoved) {
            return res.status(200).json("Editor deleted...");
        } else {
            return res.status(400).json("Editor is not available")
        }
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.message });
        return res.status(400).json(error);
    }
};