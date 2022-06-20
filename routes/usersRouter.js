var express = require('express');
var userRouter = express.Router();
const {
  newUser,
  listUsers
} = require('../controllers/Users/user');


// userRouter.get('/', function (req, res, next) {
//   return res.status(200).json({ message: "User List" })
// });

userRouter.post('/create', newUser);
userRouter.get('/list', listUsers);



module.exports = userRouter;
