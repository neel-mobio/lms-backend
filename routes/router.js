var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  const data = "Connected Successfully...."
  console.log("Connected Successfully")
  return res.status(200).json({data:data})
});

module.exports = router;
