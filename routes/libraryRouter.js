var express = require('express');
var libraryRouter = express.Router();
const {
    newLibrary,
        listLibrarys,
        libraryDetails,
        updateLibraryDetails,
        libraryRemove,
} = require('../controllers/Librarys/library');


libraryRouter.post('/create', newLibrary);
libraryRouter.get('/list',listLibrarys);
libraryRouter.get('/:library_id/details',libraryDetails);
libraryRouter.put('/:library_id/update',updateLibraryDetails);
libraryRouter.delete('/:library_id/delete',libraryRemove);

module.exports = libraryRouter;