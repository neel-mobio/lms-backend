const mongoose = require("mongoose");

const editorSchema = new mongoose.Schema({
    editor_name: String
});

module.exports = mongoose.model("Editors", editorSchema);