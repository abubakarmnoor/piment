//this code is for conenct to db
const mysql = require('mysql2');
require('dotenv').config();
module.exports.stablishedConnection = ()=>{
return new Promise((resolve,reject)=>{
  const con = mysql.createConnection( {
    host: process.env.DB_HOST||localhost,
    user: process.env.DB_USER_NAME||piment ,
    password: process.env.DB_PASSWORD||`1Gw02wJYPM6@`,
    database: process.env.DB_NAME||piment
  });
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