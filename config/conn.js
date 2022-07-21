//this code is for conenct to db
const mysql = require('mysql2');
require('dotenv').config();
module.exports.stablishedConnection = ()=>{
return new Promise((resolve,reject)=>{
  const con = mysql.createConnection( {
    host: `localhost`,
    user: `piment` ,
    password: `1Gw02wJYPM6@`,
    database: `piment`
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