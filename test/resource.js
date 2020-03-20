var { expect } = require('chai');
var knex = require('knex');
var supertest = require('supertest');

var { test: testConfig } = require('../knexfile');
var app = require('../app');

var _ = require('lodash');

describe.only('resource class', () => {
  describe('donation_method_type example', () => {
    var agent, db;

    before(async () => {
      db = knex(testConfig);
      await db.migrate.latest();
      app.setDb(db);
      agent = supertest.agent(app);
    });

    after(async () => {
      await db.destroy();
    });

    it('should get the resource', async () => {
      var response = await agent.get('/donation_method_type');
      expect(response.body).to.be.an('array');
    });

    it('should post a response and get correct id', async () => {
      var n = { name: 'external_campaign' };
      var response = await agent.post('/donation_method_type').send(n);
      expect(response.body.id).to.be.a('number');
      var { id } = response.body;
      var row = await db('donation_method_type').where({ id }).first();

      var entity = _.pick(row, Object.keys(n));
      expect(entity).to.eql(n);
    });

    it('should try to insert duplicate of previous test', async () => {
      var n = { name: 'external_campaign' };
      var response = await agent.post('/donation_method_type').send(n);
      var { error } = response.body;
      expect(error).to.match(/Could not make duplicate entry/i);
    });

    it('should get single', async () => {
      var n = { name: 'paypal_link' };
      var [ id ] = await db('donation_method_type').insert(n);
      var { body: row } = await agent.get('/donation_method_type/' + id);
      
      var entity = _.pick(row, Object.keys(n));
      expect(entity).to.eql(n);
    });

    it('should edit single', async () => {
      var n = { name: 'cashapp_url' };
      var edit = { name: 'cash_app_url' };
      var [ id ] = await db('donation_method_type').insert(n);

      await agent.post('/donation_method_type/' + id).send(edit);
      
      var row = await db('donation_method_type').where({ id }).first();
      var entity = _.pick(row, Object.keys(n));
      expect(entity).to.eql(edit);
    });

    it('should refuse edit single which creates duplicate', async () => {
      var n = [{ name: 'venmo_name' }, { name: 'venmo_name_1' }];
      var n_id = await Promise.all(n.map(async e => {
        var [ i ] = await db('donation_method_type').insert(e); return i;
      }));
      
      var r = await agent.post('/donation_method_type/' + n_id[1]).send(n[0]);
      expect(r.body.error).match(/Cannot change entity in/i);
      expect(r.body.error).match(/donation_method_type/i);
      expect(r.body.error).match(/venmo_name/i);
    });

    it('should refuse edit single which does not exist', async () => {
      var r = await agent.post('/donation_method_type/99999').send({});
      expect(r.body.error).to.match(/Entity for id 99999 not present/);
    });

    it('should delete a resource', async () => {
      var n = { name: 'sample' };
      var { body: { id }} = await agent.post('/donation_method_type').send(n);
      await agent.delete('/donation_method_type/' + id);
      var { body } = await agent.get('/donation_method_type/' + id);
      expect(body).to.be.null;
    });
  });

  describe('unit-ish tests', () => {
    
  });
});
