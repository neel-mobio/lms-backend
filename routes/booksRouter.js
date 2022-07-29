var express = require('express');
var bookRouter = express.Router();
const {
    newBook,
    listBooks,
    bookDetails,
    updateBookDetails,
    bookRemove,
    bookCirculation,
    booklistExport
} = require('../controllers/Books/book');


bookRouter.post('/create',newBook);
bookRouter.get('/list', listBooks);
bookRouter.get('/:book_id/details',bookDetails);
bookRouter.put('/:book_id/update',updateBookDetails);
bookRouter.delete('/:book_id/delete',bookRemove);
bookRouter.get('/books-circulation',bookCirculation);
bookRouter.get('/export-excel',booklistExport);


module.exports = bookRouter;