var express = require('express');
var router = express.Router();

var { Resource } = require('../lib');

// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// var urouter = express.Router();
// router.use('/user', urouter);

// var f = new Resource({ table: 'user' });
// urouter.get('/', f.list());
// urouter.post('/', f.create());
// urouter.get('/:id', f.single());
// urouter.post('/:id', f.update());
// urouter.delete('/:id', f.drop());

router.use('/donation_method_type', require('./donation_method_type'));

module.exports = router;
