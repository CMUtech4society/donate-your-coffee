var { expect } = require('chai');
var knex = require('knex');

var { test: testConfig } = require('../knexfile');

describe('user db functions', () => {
  var db;

  before(async () => {
    db = knex(testConfig);
    await db.migrate.latest();
  });

  after(async () => {
    await db.destroy();
  });

  it('should see the admin user', async () => {
    // console.log('ok');
    expect(await db('user').select()).to.have.length(1);
  });
});
