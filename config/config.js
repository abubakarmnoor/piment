require('dotenv').config()

const env = process.env;
// console.log(env.DB_NAME);

const config = {
  db: { 
    host: `localhost`,
    user: `piment`,
    password: `1Gw02wJYPM6@`,
    database: `piment`,
  },
  listPerPage: env.LIST_PER_PAGE || 10,
};


module.exports = config;