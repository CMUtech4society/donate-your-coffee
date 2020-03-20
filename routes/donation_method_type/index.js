var express = require('express');
var router = express.Router();

var { Resource } = require('../../lib');

var r = new Resource({ table: 'donation_method_type' });

router.get('/', r.list());
router.post('/', r.create());
router.get('/:id', r.single());
router.post('/:id', r.update());
router.delete('/:id', r.delete());

module.exports = router;
