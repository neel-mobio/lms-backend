const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_firstname: String,
    user_lastname: String,
    user_type: String,
    member_code: String,
    library: String,
    user_status: Boolean,
    user_havebook: [
        {
            book_id: String,
            book_name: String,
            book_issuedate: Date,
            book_return_due_date: Date,
            book_returndate: Date,
            book_status: String
        }
    ],
    user_phone_number: Number,
    user_email: {
        type: String,
        lowercase: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    user_password: String,
    user_profile: String,
    is_deleted: Boolean,
    // created_at: new Date(),
},
    { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);
