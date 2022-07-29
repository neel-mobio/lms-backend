var express = require('express');
var creatorRouter = express.Router();
const {
    newCreator,
    listCreator,
    creatorDetails,
    updateCreatorDetails,
    creatorRemove
} = require("../controllers/Creators/creator");

creatorRouter.post('/create', newCreator);
creatorRouter.get('/list', listCreator);
creatorRouter.get('/:creator_id/details',creatorDetails);
creatorRouter.put('/:creator_id/update',updateCreatorDetails);
creatorRouter.delete('/:creator_id/delete',creatorRemove);

module.exports = creatorRouter;
