var express = require('express');
var bookRouter = express.Router();
const {
    newBook,
    listBooks,
    bookDetails,
    updateBookDetails,
    bookRemove
} = require('../controllers/Books/book');


bookRouter.post('/create',newBook);
bookRouter.get('/list', listBooks);
bookRouter.get('/:book_id/details',bookDetails);
bookRouter.put('/:book_id/update',updateBookDetails);
bookRouter.delete('/:book_id/delete',bookRemove);


module.exports = bookRouter;