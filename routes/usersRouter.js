var express = require('express');
var userRouter = express.Router();
const {
  newUser,
  listUsers,
  userDetails,
  updateUserDetails,
  userRemove,
  issuesBook,
  deliverBook
} = require('../controllers/Users/user');
const {isAuthenticated} = require('../middleware/authGaurd')

// userRouter.get('/', function (req, res, next) {
//   return res.status(200).json({ message: "User List" })
// });

userRouter.post('/create', newUser);
userRouter.get('/list', listUsers);
userRouter.get('/:user_id/details',userDetails);
userRouter.put('/:user_id/update',updateUserDetails);
userRouter.delete('/:user_id/delete',userRemove);
userRouter.put('/:user_id/books/:book_id/issues',issuesBook);
userRouter.put('/:user_id/books/:book_id/deliver',deliverBook);

module.exports = userRouter;
