var express = require('express');
const { signIn,
        signOut
} = require('../controllers/Auth/auth');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('index', { title: 'Express' });
  const data = "Connected Successfully...."
  console.log("Connected Successfully")
  return res.status(200).json({ data: data })
});

router.post('/', signIn);
router.post('/logout',signOut);

module.exports = router;
