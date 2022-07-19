var express = require("express");
var bookTypesRouter = express.Router();
const {
    newBookType,
    listBookType,
    bookTypeDetails,
    updateBookTypeDetails,
    bookTypeRemove
} = require("../controllers/BookTypes/bookTypes");


bookTypesRouter.post('/create', newBookType);
bookTypesRouter.get('/list', listBookType);
bookTypesRouter.get('/:bookType_id/details', bookTypeDetails);
bookTypesRouter.put('/:bookType_id/update', updateBookTypeDetails);
bookTypesRouter.delete('/:bookType_id/delete', bookTypeRemove);



module.exports = bookTypesRouter;