const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.Users = require("./user.js");
db.Books = require("./book");
db.BookCirculations = require("./bookCirculation");
db.Authors = require("./author");
db.Writers = require("./writer");
db.Publishers = require("./publisher");
db.Editors = require('./editors');
db.BookTypes = require('./booktypes');
db.BookLanguages = require('./bookLanguage');

module.exports = db;
