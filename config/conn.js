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

module.exports.closeDbConnection =(con)=> {
  con.destroy();
}