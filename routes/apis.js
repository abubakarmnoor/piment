const session = require('express-session');
const express = require('express');
const bcrypt = require("bcrypt")
// const app = express();
const router = express.Router();
// const bodyParser = require('body-parser');
// const tsqlPull = require('../tsql/pull');
//fs = require('fs');
const axios = require('axios');
const cors = require('cors');
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
  res.set('Cache-Control', 'max-age=0');// 60s x 60m x 24h x ? day
	next()
})

router.use(cors({
    origin: 'https://piment-admin.localpro100.com'
}));
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
    const _q = `call spselect('tbl_`+ _tbl +`', '`+ _id +`', '`+ _type +`', '`+ _id2 +`');`
    // console.log(_q);
    db.query(_q,null, function (err, data_) { 
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
  
  //console.log(query);
//  return   res.status(200).json({success:false, query})

  stablishedConnection()
  .then((db)=>{
    stablishedConnection()
    .then((db)=>{
      if (_data.tblname == 'rm'){
        query='call spsave_rm (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        db.query(` `+query+` `,[_data.rm_guid, _data.rm_code, _data.rm_desc, _data.rm_prod_family, _data.rm_cost, _data.rm_unit, _data.rm_box_size_l, _data.rm_box_size_w, _data.rm_box_size_h, _data.rm_kayu, _data.rm_active, _data.rm_upd_by], (err, data_)=>{
          if (!data_){
            res.status(200).json({success:false, err})
          }else{
            let data = data_;
            res.status(200).json({success:true, data})
            closeDbConnection(db)
          }
        })
      }else if (_data.tblname == 'fp'){
        query='call spsave_fp (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
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
      }else if (_data.tblname == 'fp_cp'){
        query='call spsave_fp_cp (?, ?, ?, ?, ?, ?, ?, ?)'
        db.query(` `+query+` `,[_data.fp_cp_guid, _data.fp_guid, _data.fp_cp_type, _data.fp_cp_rm_guid, _data.fp_cp_qty, _data.fp_cp_unit, _data.fp_cp_price, _data.fp_cp_upd_by], (err, data_)=>{  
        // db.query(query, (err, data_)=>{
          if (!data_){
            res.status(200).json({success:false, err})
          }else{
            let data = data_;
            res.status(200).json({success:true, data})
            closeDbConnection(db)
          }
        })
      }else if (_data.tblname == 'fp_cp_copy'){
        query='call spsave_fp_cp_copy (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        db.query(` `+query+` `,[_data.fp_guid, _data.fp_cp_type, _data.fp_guid_copy, _data.cklampshade, _data.ckstand, _data.ckeuro, _data.ckus, _data.ckjapan, _data.ckuk, _data.ckaus, _data.fp_cp_upd_by], (err, data_)=>{  
        // db.query(query, (err, data_)=>{
          if (!data_){
            res.status(200).json({success:false, err})
          }else{
            let data = data_;
            res.status(200).json({success:true, data})
            closeDbConnection(db)
          }
        })
      }else if (_data.tblname == 'supplier'){
      query='call spsave_supplier (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      db.query(` `+query+` `,[_data.supplier_guid, _data.supplier_name, _data.supplier_address, _data.supplier_state, _data.supplier_country, _data.supplier_zipcode, _data.supplier_pic, _data.supplier_email, _data.supplier_phone, _data.supplier_fax, _data.supplier_whatsapp , _data.supplier_prod_family , _data.supplier_active , _data.supplier_upd_by, _data.supplier_note], (err, data_)=>{  
      // db.query(query, (err, data_)=>{
        if (!data_){
          res.status(200).json({success:false, err})
        }else{
          let data = data_;
          res.status(200).json({success:true, data})
          closeDbConnection(db)
        }
      })
    }else if (_data.tblname == 'pop'){
      query='call spsave_pop (?, ?, ?, ?, ?)'
      db.query(` `+query+` `,[_data.pop_guid, _data.pop_type, _data.pop_desc, _data.pop_active, _data.pop_updated_by], (  err, data_)=>{  
      // db.query(query, (err, data_)=>{
        if (!data_){
          res.status(200).json({success:false, err})
        }else{
          let data = data_;
          res.status(200).json({success:true, data})
          closeDbConnection(db)
        }
      })
    }else if (_data.tblname == 'client'){
      query='call spsave_client (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      db.query(` `+query+` `,[_data.client_guid, _data.client_name, _data.client_address, _data.client_state, _data.client_country, _data.client_zipcode, _data.client_pic, _data.client_email, _data.client_phone, _data.client_fax, _data.client_whatsapp, _data.client_activity,  _data.client_note, _data.client_active , _data.client_upd_by], (err, data_)=>{  
      // db.query(query, (err, data_)=>{
        if (!data_){
          res.status(200).json({success:false, err})
        }else{
          let data = data_;
          res.status(200).json({success:true, data})
          closeDbConnection(db)
        }
      })
    }else if (_data.tblname == 'stock'){
      query='call spsave_stock (?, ?, ?, ?, ?, ?, ?, ?)'
      db.query(` `+query+` `,[_data.stock_guid, _data.stock_type, _data.stock_type_guid, _data.stock_info, _data.stock_qty, _data.stock_price, _data.stock_trans_date, _data.stock_upd_by], (err, data_)=>{  
      // db.query(query, (err, data_)=>{
        if (!data_){
          res.status(200).json({success:false, err})
        }else{
          let data = data_;
          res.status(200).json({success:true, data})
          closeDbConnection(db)
        }
      })
    }else if (_data.tblname == 'co'){
      query='call spsave_co (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      db.query(` `+query+` `,[_data.co_guid, _data.co_order_id, _data.co_client_guid, _data.co_order_date, _data.co_delivery_date, _data.co_status, _data.co_notes, _data.co_standard, _data.co_curr, _data.co_rate, _data.co_area, _data.co_vip, _data.co_upd_by], (err, data_)=>{  
      // db.query(query, (err, data_)=>{
        if (!data_){
          res.status(200).json({success:false, err})
        }else{
          db.query(`select * from tbl_co where co_order_id=?`,[_data.co_order_id], (err, data__)=>{
            if (!data__){
              res.status(200).json({success:false, err})
            }else{
              let data = data__;
              // console.log(data);
              res.status(200).json({success:true, data})
            }
          })
          closeDbConnection(db)
        }
      })
    }else if (_data.tblname == 'co_order'){
      query='call spsave_co_order (?, ?, ?, ?, ?, ?, ?, ?)'
      db.query(` `+query+` `,[_data.co_order_guid, _data.co_order_co_guid, _data.co_order_fp_guid, _data.co_order_cost, _data.co_order_price, _data.co_order_qty, _data.co_order_info, _data.co_order_upd_by], (err, data_)=>{  
      // db.query(query, (err, data_)=>{
        if (!data_){
          res.status(200).json({success:false, err})
        }else{
          let data = data_;
          res.status(200).json({success:true, data})
          closeDbConnection(db)
        }
      })
    }else if (_data.tblname == 'inv'){
      query='call spsave_inv (?, ?, ?, ?, ?, ?, ?, ?, ?)'
      db.query(` `+query+` `,[_data.inv_guid, _data.inv_co_guid, _data.inv_id, _data.inv_code, _data.inv_amount, _data.inv_amount_paid, _data.inv_paid_date, _data.inv_info, _data.inv_upd_by], (err, data_)=>{  
      // db.query(query, (err, data_)=>{
        if (!data_){
          res.status(200).json({success:false, err})
        }else{
          let data = data_;
          res.status(200).json({success:true, data})
          closeDbConnection(db)
        }
      })
    }else if (_data.tblname == 'prod'){
      query='call spsave_prod (?, ?, ?, ?, ?, ?, ?)'
      db.query(` `+query+` `,[_data.prod_guid, _data.prod_co_guid, _data.prod_id, _data.prod_pic, _data.prod_status , _data.prod_info, _data.prod_upd_by], (err, data_)=>{  
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
    query='call spdelete_rm (?, ?)'
    // query.concat(" ")
  }else if (_data.tblname == 'fp'){
    query='call spdelete_fp (?, ?)'
  }else if (_data.tblname == 'fp_cp'){
    query='call spdelete_fp_cp (?, ?)'
  }else if (_data.tblname == 'supplier'){
    query='call spdelete_supplier (?, ?)'
  }else if (_data.tblname == 'pop'){
    query='call spdelete_pop (?, ?)'
  }else if (_data.tblname == 'client'){
    query='call spdelete_client (?, ?)'
  }else if (_data.tblname == 'stock'){
    query='call spdelete_stock (?, ?)'
  }else if (_data.tblname == 'co'){
    query='call spdelete_co (?, ?)'
  }else if (_data.tblname == 'co_order'){
    query='call spdelete_co_order (?, ?)'
  }else if (_data.tblname == 'inv'){
    query='call spdelete_inv (?, ?)'
  }else if (_data.tblname == 'prod'){
    query='call spdelete_prod (?, ?)'
  }
  // res.status(200).json({success:true, query})

  stablishedConnection()
  .then((db)=>{
    stablishedConnection()
    .then((db)=>{
      db.query(` `+query+` `,[_data.id, _data.upd_by], (err, data_)=>{
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
router.get('/pop/:type', function(req,res){
	// res.status(200).json({sucess:false});
  
  // console.log(req.headers['access-control-allow-origin']);
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

router.get('/pass', async function(req,res){
  
  const hash_ = await hashPass('abubakar');
  const pass_ = await comparePass('abubakar',hash_);
  res.status(200).json({hash: hash_, pass: pass_ })
  
})
router.get('/auto-id', async function(req,res){
  
  try {
    db.query(`call spautoid();`,null, function (err, data_) { 
      if (!data_) {
        res.status(200).json({success:false,err});
      }else{
        let data = data_[0]
        res.status(200).json({success:true,data});
        closeDbConnection(db);
        // console.log("Db Connection close Successfully");
      }
    })                           
  } catch (error) {
    console.log("Db not connected",error);
  }
  
})
//functions
async function hashPass(plaintextPassword) {
  const hash = await bcrypt.hash(plaintextPassword, 11);
  return hash;
}

// compare password
async function comparePass(plaintextPassword, hash) {
  const result = await bcrypt.compare(plaintextPassword, hash);
  return result;
}

module.exports = router;
