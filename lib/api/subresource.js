function SubResourceMWFactory(config = {}) {
  this.validate(config);

  this.parent = config.parent;
  this.table = config.table;
  this.fields = config.fields || ['name'];

  var queries = this.queries = {};
  queries.create = config.create || (knex => { });
  queries.list = config.list || (knex => { });
  queries.update = config.update || (knex => { });
  queries.drop = config.drop || (knex => { });
  queries.single = config.single || (knex => { });
}

SubResourceMWFactory.prototype.validate = function(config) {
  var errors = [];
  if (typeof config.parent === 'string')
    errors.push('SubResourceMWFactory: Missing parent property');
  if (typeof config.table === 'string')
    errors.push('SubResourceMWFactory: Missing child table property');

  if (errors.length)
    throw new Error(errors.join(', '));
};

module.exports = SubResourceMWFactory;
