const express = require('express');
const app = express();
const router = express.Router();
// const tsqlPull = require('../tsql/pull');
//fs = require('fs');
const axios = require('axios');
const {stablishedConnection,closeDbConnection}  =require('../config/conn');
var cors = require('cors')
var corsOptions = {
  origin: 'http://localhost:8000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

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

router.get('/pull/:tblname/:id?', cors(corsOptions), function(req,res){
	// res.status(200).json({sucess:false});
  let _tbl = req.params.tblname;
  let _id = req.params.id;
  console.log(_id);
  if (_tbl == 'rm'){
    _tbl = 'tbl_rm'
  }
  stablishedConnection()
  .then((db)=>{
    // console.log("Db connection stablished");
    db.query(`call spselect('`+ _tbl +`', '`+ _id +`');`,null, function (err, data_) { 
      if (!data_) {
        res.status(200).json({success:false,err});
      }else{
        let data = data_[0]
        res.status(200).json({success:true,data});
        closeDbConnection(db);
        // console.log("Db Connection close Successfully");
      }
    })                         
  }).catch((error)=>{
    console.log("Db not connected",error);
  });   
});

router.post('/upd',(req,res)=>{
  const _data = req.body.data
  let query='';
  if (_data.tblname == 'rm'){
    query='call spsave_rm ? ? ? ? ? ? ? ? ? ? ?'

  }

  stablishedConnection()
  .then((db)=>{
    stablishedConnection()
    .then((db)=>{
      db.query(` `+query+` `,[_data.rm_codex, _data.rm_desc, _data.rm_prod_family, _data.rm_cost, _data.rm_unit, _data.rm_box_size_l, _data.rm_box_size_w, _data.rm_box_size_h, _data.rm_kayu, _data.rm_created_by, _data.rm_upd_by], (err, data_)=>{
        if (!data_){
          res.status(200).json({success:false, err})
        }else{
          let data = data_[0]
          res.status(200).json({success:true, data})
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
