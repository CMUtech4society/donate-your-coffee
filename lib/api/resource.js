var { pageSize } = require('../util');

function Resource(config = {}) {
  this._validate(config);

  this.resource_param = config.resource_param || 'id';
  this.table = config.table;
  this.fields = config.fields || ['name'];

  // var queries = this.queries = {};
  // queries.count = config.count || (knex => { });
  // queries.create = config.create || (knex => { });
  // queries.list = config.list || (knex => { });
  // queries.update = config.update || (knex => { });
  // queries.drop = config.drop || (knex => { });
  // queries.single = config.single || (knex => { });
}

Resource.prototype._validate = function(config) {
  if (typeof config.table !== 'string')
    throw new Error('Resource missing ctor config property table');
};

Resource.prototype._fieldApplier = function() {
  return () => {
    this.fields.forEach(function(field) {
      this.orWhere(field, 'like', '%' + search + '%');
    });
  };
};

Resource.prototype._missingParam = function(extra) {
  throw new Error([
    'Need to provide parameter', this.resource_param,
    'for resource in table', this.table
  ].join(' '));
};

Resource.prototype._count = async function(db, search) {
  var query = db(this.table).count().first();

  if (search)
    query.where(this._fieldApplier());

  var { 'count(*)': count } = await query;
  return count;
};

Resource.prototype._create = async function(db, body) {
  try {
    var [ id ] = await db(this.table).insert(body);
    return id;
  } catch (e) {
    if (/duplicat|unique/i.test(e + ''))
      throw new Error('Could not make duplicate entry in ' + this.table +
        ' for entity ' + JSON.stringify(body));
    throw e;
  }
};

Resource.prototype.create = function() {
  return async (req, res, next) => {
    var id = await this._create(req.db, req.body);
    res.json({ id });
  };
};

Resource.prototype._list = async function(db, page, size, search) {
  var query = db(this.table).select().limit(size).offset((page - 1) * size);

  if (search)
    query.where(this.fieldApplier());

  return await query;
};

Resource.prototype.list = function() {
  return async (req, res, next) => {
    var [ page, size ] = pageSize(req);
    var { search } = req.query;

    var [ count, result ] = await Promise.all([
      this._count.call(this, req.db, search),
      this._list.call(this, req.db, page, size, search)
    ]);

    res.set('X-Count', count);
    res.json(result);
  };
};

Resource.prototype._update = async function(db, id, body) {
  var entity = await db(this.table).where({ id }).first();
  if (!entity)
    throw new Error('Entity for id ' + id + ' not present, cant be edited');

  entity = Object.assign({}, entity, body);
  try {
    await db(this.table).update(entity).where({ id });
  } catch (e) {
    if (/duplicat|unique/i.test(e + ''))
      throw new Error('Cannot change entity in ' + this.table + ' ' + id +
        ' to ' + JSON.stringify(body) + ' because it is a duplicate ');
    throw e;
  }
};

Resource.prototype.update = function() {
  return async (req, res, next) => {
    var param = req.params[this.resource_param] || this._missingParam();
    await this._update(req.db, param, req.body);
    res.status(200).end();
  };
};

Resource.prototype._single = async function(db, id) {
  return (await db(this.table).where({ id }).first()) || null;
};

Resource.prototype.single = function() {
  return async (req, res, next) => {
    var param = req.params[this.resource_param] || this._missingParam();
    var entity = await this._single(req.db, param);
    res.json(entity);
  };
};

Resource.prototype._delete = async function(db, id) {
  await db(this.table).delete().where({ id });
};

Resource.prototype.delete = function() {
  return async (req, res, next) => {
    var param = req.params[this.resource_param] || this._missingParam();
    var entity = await this._delete(req.db, param);
    res.json(entity);
  };
};

module.exports = Resource;
