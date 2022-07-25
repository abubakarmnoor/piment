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

router.get('/pull/:tblname',function(req,res){
	// res.status(200).json({sucess:false});
  const _tbl = req.params.tblname;
  
  stablishedConnection()
  .then((db)=>{
    // console.log("Db connection stablished");
    db.query(`call spSelect('`+ _tbl +`');`,null, function (err, data) { 
      if (!data) {
        res.status(200).json({success:false,err});
      }else{
        let data = data[0]
        res.status(200).json({success:true,data});
        closeDbConnection(db);
        // console.log("Db Connection close Successfully");
      }
    })                         
  }).catch((error)=>{
    console.log("Db not connected",err);
  });   
});

router.post('/upd',(req,res)=>{
  const _data = req.body.data
  let query='';
  if (_data.tblname == 'rm'){
    query='call spSave_rm ? ? ? ? ?'

  }

  stablishedConnection()
  .then((db)=>{
    stablishedConnection()
    .then((db)=>{
      db.query(` `+query+` `,null, (err, data)=>{
        if (!data){
          res.status(200).json({success:false, err})
        }else{
          let data_ = data[0]
          res.status(200).json({success:true, data_})
          closeDbConnection(db)
        }
      })
    })
  }).catch((error)=>{
    console.log("Db not connected",err);
  }); 

})

//functions

module.exports = router;
