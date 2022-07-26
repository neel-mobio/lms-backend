const mongoose = require("mongoose");

const librarySchema = new mongoose.Schema({
    library_name: String,
    llibrary_phone_no: Number,
    library_city: String,
    library_addrress: String,
    library_status: Boolean,
    // created_at: Date,
    is_deleted: Boolean
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Librarys", librarySchema);