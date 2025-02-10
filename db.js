const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'gh',
    password: 'Lagartixa.123',
    port: 5432,
});

module.exports = pool;