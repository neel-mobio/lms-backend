var express = require('express');
var authorRouter = express.Router();
const {
    newAuthor,
    listAuthor,
    authorDetails,
    updateAuthorDetails,
    authorRemove
} = require("../controllers/Author/author");


authorRouter.post('/create',newAuthor);
authorRouter.get('/list', listAuthor);
authorRouter.get('/:author_id/details',authorDetails);
authorRouter.put('/:author_id/update',updateAuthorDetails);
authorRouter.delete('/:author_id/delete',authorRemove);

module.exports = authorRouter;