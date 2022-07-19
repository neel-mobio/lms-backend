var express = require("express");
var editorRouter = express.Router();
const {
    newEditor,
    listEditor,
    editorDetails,
    updateEditorDetails,
    editorRemove
} = require ('../controllers/Editor/editor');


editorRouter.post('/create',newEditor);
editorRouter.get('/list', listEditor);
editorRouter.get('/:editor_id/details', editorDetails);
editorRouter.put('/:editor_id/update', updateEditorDetails);
editorRouter.delete('/:editor_id/delete', editorRemove);

module.exports = editorRouter;