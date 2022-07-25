var createError             = require('http-errors');
var express                 = require('express');
const mongoose              = require('mongoose');
var path                    = require('path');
var cookieParser            = require('cookie-parser');
var logger                  = require('morgan');
require("dotenv").config();
var router                  = require('./routes/router');
var auth              = require('./routes/authRouter');
var UsersRouter             = require('./routes/usersRouter');
var BookRouter              = require('./routes/booksRouter');
// var LibraryRouter           = require('./routes/libraryRouter');
var AuthorRouter            = require('./routes/authorRouter');
var WriterRouter            = require('./routes/writersRouter');
var PublisherRouter         = require('./routes/publisherRouter');
var EditorRouter            = require('./routes/editorRouter');
var BookTypeRouter          = require('./routes/bookTypesRouter');
var BookLanguages           = require('./routes/languageRouter');
var DashboardRouter         = require('./routes/dashboardRouter');
const verifyToken           = require("./routes/validate-token");
var app                     = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);
app.use('/auth',auth);
app.use('/users',verifyToken, UsersRouter);
app.use('/books',verifyToken,BookRouter);
// app.use('/librarys',verifyToken, LibraryRouter);
app.use('/author',verifyToken, AuthorRouter);
app.use('/writer',verifyToken, WriterRouter);
app.use('/publisher',verifyToken, PublisherRouter);
app.use('/editor',verifyToken, EditorRouter);
app.use('/booktype',verifyToken, BookTypeRouter);
app.use('/booklanguage',verifyToken, BookLanguages);
app.use('/dashboard',verifyToken, DashboardRouter);

const db = require("./models/index");
// const dbURI = "mongodb://localhost:27017"
mongoose
	.connect(process.env.DATABASE_URL, {
		useNewUrlParser: true,
		// useCreateIndex: true,
		useUnifiedTopology: true,
	})
	.then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

mongoose.Promise = global.Promise;

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
