var express = require('express');
var writerRouter = express.Router();
const {
    newWriter,
    listWriter,
    writerDetails,
    updateWriterDetails,
    writerRemove

} = require('../controllers/Writer/writer');


writerRouter.post('/create',newWriter);
writerRouter.get('/list',listWriter);
writerRouter.get('/:writer_id/details',writerDetails);
writerRouter.put('/:writer_id/update',updateWriterDetails)
writerRouter.delete('/:writer_id/delete',writerRemove);


module.exports = writerRouter;
