//this code is for conenct to db
const mysql = require('mysql2');
require('dotenv').config();
const config = require('./config');
module.exports.stablishedConnection = ()=>{
return new Promise((resolve,reject)=>{
  const con = mysql.createConnection(config.db);
  con.connect((err) => {
    if(err){
      reject(err);
    }
    resolve(con);
  });
  
})
}
const config = {
    db: { 
      host: `localhost`,
      user: `piment`,
      password: `1Gw02wJYPM6@`,
      database: `piment`,
    },
    listPerPage: env.LIST_PER_PAGE || 10,
  };
module.exports.closeDbConnection =(con)=> {
  con.destroy();
}