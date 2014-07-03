var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send([1,6,2,7,8,15,21,72,41])
});

module.exports = router;
