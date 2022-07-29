var express = require("express");
var roleRouter = express.Router();
const {
    newRole,
    listRole,
    roleDetails,
    updateRoleDetails,
    roleRemove
} = require("../controllers/Roles/role");


roleRouter.post('/create', newRole);
roleRouter.get('/list', listRole);
roleRouter.get('/:role_id/details',roleDetails);
roleRouter.put('/:role_id/update',updateRoleDetails);
roleRouter.delete('/:role_id/delete',roleRemove);

module.exports = roleRouter;