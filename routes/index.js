var express = require('express');
var router = express.Router();

/* GET page d'acceuil. */
router.get('/', function(req, res) {
  res.render('accueil', { title: 'TP3 - INF4375 - Automne 2014' });
});

/* GET documentation. */
router.get('/doc', function(req, res) {
  res.render('doc');
});

module.exports = router;
