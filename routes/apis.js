const express = require('express');
const app = express();
const router = express.Router();
// const tsqlPull = require('../tsql/pull');
//fs = require('fs');
const axios = require('axios');
const {stablishedConnection,closeDbConnection}  =require('../config/conn');

router.use(function (req, res, next) {
	res.set('Cache-Control', 'max-age=0');// 60s x 60m x24 x ? day
	next()
})
//API - DB
// /* GET programming languages. */
// router.get('/getdata', async function(req, res, next) {
// 	try {
// 		console.log(req.query.tbl);
// 		console.log(req.query.page);//
// 	  res.json(await tsqlPull._getdata(req.query.tbl, req.query.page));
// 	} catch (err) {
// 	  console.error(`Error while getting programming languages `, err.message);
// 	  next(err);
// 	}
// });

router.get('/getdata/:tblname/:offset/:page',function(req,res){
	// res.status(200).json({sucess:false});
  const _tbl = req.params.tblname
  const _offset = req.params.offset
  const _page = req.params.page 

  stablishedConnection()
  .then((db)=>{
    // console.log("Db connection stablished");
    db.query(`select * from ? limit `+_offset+`,`+_page+` `,null, function (err,data) { 
      if (!data) {
        res.status(200).json({sucess:false,err});
      }else{
        res.status(200).json({sucess:true,data});
        closeDbConnection(db);
        // console.log("Db Connection close Successfully");
      }
  })                         
}).catch((error)=>{
  console.log("Db not connected successfully",error);
});   
});

//functions

module.exports = router;
