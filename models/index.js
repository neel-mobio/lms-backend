const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.Users = require("./user.js");
db.Books = require("./book");
db.BookCirculations = require("./bookCirculation");

module.exports = db;
