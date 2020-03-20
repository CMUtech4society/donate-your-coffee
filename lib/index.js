var util = require('./util');
var {
  Resource, SubResource
} = require('./api');

module.exports = {
  Resource, SubResource,
  ...util
};

