const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    role_name: String,
    display_name: String,
    discription: String,
    role_permissions: {
        manage_books: Boolean,
        manage_issue_books: Boolean,
        manage_members: Boolean,
        manage_finance: Boolean,
        manage_settings:Boolean,
        manage_roles: Boolean,
        manage_authors: Boolean,
        manage_publishers: Boolean,
        manage_book_series: Boolean,
        manage_users: Boolean,
        manage_book_languages: Boolean,
        manage_plans: Boolean,
        manage_tags: Boolean,
        manage_genres: Boolean,
        manage_book_requests: Boolean,
        manage_penalties: Boolean,
        manage_editors: Boolean,
        manage_book_types: Boolean,
        manage_libraries: Boolean,
        manage_writers: Boolean,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("Roles", roleSchema);