var express = require("express");
var languageRouter = express.Router();
const {
    newBookLanguage,
    listBookLanguage,
    bookLanguageDetails,
    updateBookLanguageDetails,
    bookLanguageRemove
} = require("../controllers/BookLanguages/bookLanguages");



languageRouter.post('/create',newBookLanguage);
languageRouter.get('/list', listBookLanguage);
languageRouter.get('/:language_id/details', bookLanguageDetails);
languageRouter.put('/:language_id/update', updateBookLanguageDetails);
languageRouter.delete('/:language_id/delete', bookLanguageRemove);


module.exports = languageRouter;