require('dotenv').config()

const env = process.env;
console.log(env.DB_HOST);

const config = {
  db: { 
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  },
  listPerPage: env.LIST_PER_PAGE || 10,
};


module.exports = config;
// db: { 
//   host: `localhost`,
//   user: `piment`,
//   password: `1Gw02wJYPM6@`,
//   database: `piment`,
// },