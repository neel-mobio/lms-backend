var express = require("express");
var publisherRouter = express.Router();
const {
    newPublisher,
    listPublisher,
    publisherDetails,
    updatePublisherDetails,
    publisherRemove
} = require("../controllers/Publisher/publisher");


publisherRouter.post('/create', newPublisher);
publisherRouter.get('/list', listPublisher);
publisherRouter.get('/:publisher_id/details', publisherDetails);
publisherRouter.put('/:publisher_id/update', updatePublisherDetails);
publisherRouter.delete('/:publisher_id/delete', publisherRemove);



module.exports = publisherRouter;