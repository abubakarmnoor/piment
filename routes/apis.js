const session = require('express-session');
const express = require('express');
// const app = express();
const router = express.Router();
// const bodyParser = require('body-parser');
// const tsqlPull = require('../tsql/pull');
//fs = require('fs');
const axios = require('axios');
router.use(express.json());
router.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
router.use(express.urlencoded({ extended: true }));
const {stablishedConnection,closeDbConnection}  =require('../config/conn');
// var cors = require('cors')
// var corsOptions = {
//   origin: 'http://localhost:8001',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
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

router.get('/', (req,res)=>{
  if (req.session.loggedin) {
    res.status(200).send("hello")
  }else{
    res.status(200).send("not logged in ")
  }
  
})

router.get('/pull/:tblname/:id?/:type?/:id2?', function(req,res){
	// res.status(200).json({sucess:false});
  let _tbl = req.params.tblname;
  let _id = req.params.id;
  let _type = req.params.type;
  let _id2 = req.params.id2;
  // console.log(_id);
  // res.status(200).json({success:false,_tbl});
  // if (_tbl == 'rm'){
  //   _tbl = 'tbl_rm'
  // }else if (_tbl='fp'){
  //   _tbl = 'tbl_fp'
  // }else if (_tbl='fp_cp'){
  //   _tbl = 'tbl_fp_cp'
  // }
  stablishedConnection()
  .then((db)=>{
    // console.log("Db connection stablished");
    db.query(`call spselect('tbl_`+ _tbl +`', '`+ _id +`', '`+ _type +`', '`+ _id2 +`');`,null, function (err, data_) { 
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
  const _data = req.body;
  // console.log(_data);
  // return   res.status(200).json({success:false, _data})
  let query='';
  if (_data.tblname == 'rm'){
    query='call spsave_rm (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    // query.concat(" ")

  }else if (_data.tblname == 'fp'){
    query='call spsave_fp (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    // query=`call spsave_fp ('`+_data.fp_guid+`', '`+_data.fp_desc+`', '`+_data.fp_prod_family+`', '`+_data.fp_origin+`', '`+_data.fp_box_size_l+`', '`+_data.fp_box_size_w+`', '`+_data.fp_box_size_h+`', '`+_data.fp_sc_extra_cost+`', '`+_data.fp_sc_extra_labour+`', '`+_data.fp_sc_cost+`', '`+_data.fp_sc_wholesale_sale+`', '`+_data.fp_sc_wholesale_profit+`', '`+_data.fp_sc_wholesale_markup+`', '`+_data.fp_sc_business_sale+`', '`+_data.fp_sc_business_profit+`', '`+_data.fp_sc_business_markup+`', '`+_data.fp_sc_retail_sale+`', '`+_data.fp_sc_retail_profit+`', '`+_data.fp_sc_retail_markup+`', `+_data.fp_validated+`, `+_data.fp_active+`, '`+_data.fp_created_by+`')`
    // query.concat(" ")

  }

  //console.log(query);
//  return   res.status(200).json({success:false, query})

  stablishedConnection()
  .then((db)=>{
    stablishedConnection()
    .then((db)=>{
      if (_data.tblname == 'rm'){
        db.query(` `+query+` `,[_data.rm_guid, _data.rm_code, _data.rm_desc, _data.product_family, _data.cost, _data.unit, _data.box_size_l, _data.box_size_w, _data.box_size_h, _data.kayu, _data.active, _data.created_by, _data.updated_by], (err, data_)=>{
          if (!data_){
            res.status(200).json({success:false, err})
          }else{
            let data = data_;
            res.status(200).json({success:true, data})
            closeDbConnection(db)
          }
        })
      }else if (_data.tblname == 'fp'){
        db.query(` `+query+` `,[_data.fp_guid, _data.fp_desc, _data.fp_prod_family, _data.fp_origin, _data.fp_box_size_l, _data.fp_box_size_w, _data.fp_box_size_h, _data.fp_sc_extra_cost, _data.fp_sc_extra_labour, _data.fp_sc_cost, _data.fp_sc_wholesale_sale, _data.fp_sc_wholesale_profit, _data.fp_sc_wholesale_markup, _data.fp_sc_business_sale, _data.fp_sc_business_profit, _data.fp_sc_business_markup, _data.fp_sc_retail_sale, _data.fp_sc_retail_profit, _data.fp_sc_retail_markup, _data.fp_validated, _data.fp_active, _data.fp_created_by], (err, data_)=>{  
        // db.query(query, (err, data_)=>{
          if (!data_){
            res.status(200).json({success:false, err})
          }else{
            let data = data_;
            res.status(200).json({success:true, data})
            closeDbConnection(db)
          }
        })
      }
    })
  }).catch((error)=>{
    console.log("Db not connected",error);
    res.status(500).json({success:false, error})
  }); 

})
router.post('/del/:tbl',(req,res)=>{
  const _data = req.body;
  _data.tblname=req.params.tbl;
  let query='';
  if (_data.tblname == 'rm'){
    query='call spdelete_rm (?)'
    // query.concat(" ")

  }else if (_data.tblname == 'fp'){
    query='call spdelete_fp (?)'
  }
  // res.status(200).json({success:true, query})

  stablishedConnection()
  .then((db)=>{
    stablishedConnection()
    .then((db)=>{
      db.query(` `+query+` `,[_data.id], (err, data_)=>{
        if (!data_){
          res.status(200).json({success:false, err})
        }else{
          let data = data_;
          res.status(200).json({success:true, data})
          closeDbConnection(db)
        }
      })
    })
  }).catch((error)=>{
    console.log("Db not connected",error);
    res.status(500).json({success:false, error})
  }); 

})

router.post('/auth', function(req, res) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		stablishedConnection()
    .then((db)=>{
      stablishedConnection()
      .then((db)=>{
        db.query(`select * from tbl_login where login_username=? and login_passwrd=? and login_active=1 and login_deleted=0`,[_data.username, _data.passwrd ], (err, data_)=>{
          if (!data_){
            res.status(200).json({success:false, err})
          }else{
            closeDbConnection(db);
            req.session.loggedin = true;
				    req.session.username = data_[0].login_nickname;
            res.redirect('/');
            // let data = data_;
            // res.status(200).json({success:true, data})
          }
        })
      })
      }).catch((error)=>{
        console.log("Db not connected",error);
        res.status(500).json({success:false, error})
      }); 
	} else {
    res.status(400).json({success:false, err:"Invalid username and password"})
		// res.send('Please enter Username and Password!');
		// res.end();
	}
});
router.get('/pull/pop/:type', function(req,res){
	// res.status(200).json({sucess:false});
  let _type = req.params.type;
  let _undefined = req.params.undefined;

  stablishedConnection()
  .then((db)=>{
    // console.log("Db connection stablished");
    db.query(`call spselect('tbl_pop', '`+ _undefined +`', '`+ _type +`', '`+ _undefined +`');`,null, function (err, data_) { 
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

router.get('/pop/:type', function(req, res) {
  const _type = req.params.type;
  let _undefined = req.params.undefined;
  req.session.loggedin = true;

  if (req.session.loggedin) {
		stablishedConnection()
    .then((db)=>{
      stablishedConnection()
      .then((db)=>{
        db.query(`call spselect('tbl_pop', '`+_undefined+`', '`+ _type +`', '`+_undefined+`');`,null, function (err, data_) { 
          if (!data_){
            res.status(200).json({success:false, err})
          }else{
            closeDbConnection(db);
            req.session.loggedin = true;
				    req.session.username = data_[0].login_nickname;
            res.redirect('/');
            // let data = data_;
            // res.status(200).json({success:true, data})
          }
        })
      })
      }).catch((error)=>{
        console.log("Db not connected",error);
        res.status(500).json({success:false, error})
      }); 
	} else {
    res.status(401).json({success:false, err:"not logged in"})
	}
})
//functions

module.exports = router;
