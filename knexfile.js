/*var example = {
  client: 'postgresql',
  connection: {
    port: process.env.DATABASE_PORT,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_ACCESS_KEY,
  },
  pool: {
    min: process.env.DATABASE_POOL_MIN,
    max: process.env.DATABASE_POOL_MAX,
  },
  migrations: {
    directory: './knex/migrations',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: './knex/seeds',
  },
};*/

var migrations = {
  directory: './knex/migrations',
  tableName: 'knex_migrations'
};

module.exports = {
  development: {
    client: 'sqlite',
    connection: 'development.sqlite',
    migrations
  },

  // staging: { ... },

  test: {
    client: 'sqlite',
    connection: ':memory:',
    pool: { min: 1, max: 1 },
    useNullAsDefault: true,
    migrations
  },

  production: {
    client: 'mysql',
    connection: process.env.CLEARDB_DATABASE_URL,
    migrations
  }
};
