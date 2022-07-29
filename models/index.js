const dbConfig          = require("../config/db.config.js");
const db                = {};
db.url                  = dbConfig.url;

db.Users                = require("./user.js");
db.Books                = require("./book");
db.BookCirculations     = require("./bookCirculation");
db.Authors              = require("./author");
db.Writers              = require("./writer");
db.Publishers           = require("./publisher");
db.Editors              = require('./editors');
db.BookTypes            = require('./booktypes');
db.BookLanguages        = require('./bookLanguage');
db.UserLogin            = require('./userLogin');
db.Librarys             = require("./library");
db.Roles                = require("./roles");
db.Creators             = require("./creator");

const mongoose          = require("mongoose");
mongoose.Promise        = global.Promise;
db.mongoose             = mongoose;

module.exports = db;
