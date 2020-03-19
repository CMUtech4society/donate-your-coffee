
exports.up = async function(knex) {
  await knex.schema.createTable('user', t => {
    t.increments();
    t.string('username');
    t.string('password');
  });

  await knex('user').insert([
    { username: 'admin', password: 'shmadmin' }
  ]);

  await knex.schema.createTable('campaign', t => {
    t.increments();
    t.integer('added_by_user').unsigned();
    t.string('external_url');
    t.string('picture_url');
    t.string('blurb', 1000);
    t.boolean('blurb_is_md');
  });

    // t.integer().unsigned();

  await knex.schema.createTable('group', t => {
    t.increments();
    t.string('name');
    t.integer('added_by_user').unsigned();
    t.string('address', 300);
    t.decimal('lng', 10, 7);
    t.decimal('lat', 10, 7); // max 140.4301132
    t.string('external_url');
    t.string('picture_url');
    t.string('blurb', 1000);
    t.boolean('blurb_is_md');
  });

  await knex.schema.createTable('individual', t => {
    t.increments();
    t.string('name');
    t.integer('added_by_user').unsigned();
    t.string('display_name');
    t.boolean('private_name');
    t.string('external_url');
    t.string('picture_url');
    t.string('blurb', 1000);
    t.boolean('blurb_is_md');
  });

  await knex.schema.createTable('group_campaign', t => {
    t.integer('group_id').unsigned();
    t.index('group_id');
    t.integer('campaign_id').unsigned();
    t.index('campaign_id');
    t.unique([ 'group_id', 'campaign_id' ]);
  });

  await knex.schema.createTable('individual_campaign', t => {
    t.integer('individual_id').unsigned();
    t.index('individual_id');
    t.integer('campaign_id').unsigned();
    t.index('campaign_id');
    t.unique([ 'individual_id', 'campaign_id' ]);
  });

  if (!/sqlite/.test(knex.client.config.client)) {
    await knex.schema.alterTable('campaign', t => {
      t.foreign('added_by_user').references('id').inTable('user');
    });

    await knex.schema.alterTable('group', t => {
      t.foreign('added_by_user').references('id').inTable('user');
    });

    await knex.schema.alterTable('individual', t => {
      t.foreign('added_by_user').references('id').inTable('user');
    });

    await knex.schema.alterTable('group_campaign', t => {
      t.foreign('group_id').references('id').inTable('group');
      t.foreign('campaign_id').references('id').inTable('campaign');
    });

    await knex.schema.alterTable('individual_campaign', t => {
      t.foreign('individual_id').references('id').inTable('individual');
      t.foreign('campaign_id').references('id').inTable('campaign');
    });
  }
};

exports.down = async function(knex) {
  if (!/sqlite/.test(knex.client.config.client)) {
    await knex.schema.alterTable('campaign', t => {
      t.dropForeign('added_by_user');
    });

    await knex.schema.alterTable('group', t => {
      t.dropForeign('added_by_user');
    });

    await knex.schema.alterTable('individual', t => {
      t.dropForeign('added_by_user');
    });

    await knex.schema.alterTable('group_campaign', t => {
      t.dropForeign('group_id');
      t.dropForeign('campaign_id');
    });

    await knex.schema.alterTable('individual_campaign', t => {
      t.dropForeign('individual_id');
      t.dropForeign('campaign_id');
    });
  }
  await knex.schema.dropTable('user');
  await knex.schema.dropTable('campaign');
  await knex.schema.dropTable('group');
  await knex.schema.dropTable('individual');
  await knex.schema.dropTable('group_campaign');
  await knex.schema.dropTable('individual_campaign');
};
