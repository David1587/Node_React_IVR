const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'empleadosdb',
  password: '2850',
  port: 5432,
});

module.exports = pool;
