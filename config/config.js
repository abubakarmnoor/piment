require('dotenv').config()

const env = process.env;
// console.log(env.DB_NAME);

const config = {
  db: { 
    host: env.DB_HOST,
    user: `piment`,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  },
  listPerPage: env.LIST_PER_PAGE || 10,
};


module.exports = config;