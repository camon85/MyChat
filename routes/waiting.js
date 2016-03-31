var express = require('express');
var router = express.Router();

/* GET waiting listing. */
router.get('/', function(req, res, next) {
  res.render('waiting', { title: 'My Chat', user: req.user });
});

module.exports = router;
