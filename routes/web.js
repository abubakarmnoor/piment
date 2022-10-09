const express = require('express');
const app = express();
const router = express.Router();
var session = require('express-session')
const cookieParser = require("cookie-parser");
// const axios = require('axios').default;
const {getPopupData, getRM, getRMFP, getClient, getFP} = require('./functions')
const validated = require("../routes/validated")
// const tsqlPull = require('../tsql/pull');
//fs = require('fs');

const _data_countries = require("../public/data/countries.json");


const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(cookieParser());
router.use(session({
	secret: 'm43str0',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 1000 * 60 * 60 * 24 }//1day
  }))
router.use(function (req, res, next) {
	//console.log('app use 123');
	res.set('Cache-Control', 'max-age=1');// 60s x 60m x24 x ? day
	next()
})
router.get('/', isAuthenticated, (req, res) => {
	res.render('index.hbs', {
		_user : req.session.user, _user_id: req.session.user_id
	});
});

router.get('/client-order', isAuthenticated, (req, res) => {
	res.render('client-order.hbs', {
		tables_bs4: true, client_order:true, _user : req.session.user, _user_id: req.session.user_id
	});
});
router.get('/client-order-details/:coid/:act', isAuthenticated, async (req, res) => {
	const _act = req.params.act
	const _olid = req.params.coid
	const __data_pop_status = await getPopupData('co-status');
	const __data_inv_code = await getPopupData('inv-code');
	const __data_client = await getClient();
	const __data_fp = await getFP();
	res.render('client-order-details.hbs', {
		tables_bs4: true, client_order_details:true, co_guid:_olid, act:_act, __data_pop_status, __data_client, _user : req.session.user, _user_id: req.session.user_id, __data_fp, __data_inv_code
	});
});

router.get('/invoice', isAuthenticated, (req, res) => {
	res.render('invoice.hbs', {
		tables_bs4: true, _user : req.session.user, _user_id: req.session.user_id
	});
});
router.get('/purchase', isAuthenticated, (req, res) => {
	res.render('purchase.hbs', {
		tables_bs4: true, purchase:true, _user : req.session.user, _user_id: req.session.user_id
	});
});
router.get('/purchase-details/:pid/:act', isAuthenticated, (req, res) => {
	const _act = req.params.act
	const _pid = req.params.pid
	res.render('purchase-details.hbs', {
		tables_bs4: true, purchase_details:true, _pid, _act, _user : req.session.user, _user_id: req.session.user_id
	});
});
router.get('/production', isAuthenticated, (req, res) => {
	res.set('Cache-Control', 'max-age=1');
	res.render('production.hbs', {
		tables_bs4: true, production:true, _user : req.session.user, _user_id: req.session.user_id
	});
});
// router.get('/packing-list', (req, res) => {
// 	res.render('packing-list.hbs', {
// 		// flot: true
// 	});
// });
// router.get('/delivery-status', (req, res) => {
// 	res.render('delivery-status.hbs', {
// 		// flot: true
// 	});
// });
router.get('/office', isAuthenticated, (req, res) => {
	res.render('office.hbs', {
		tables_bs4: true, _user : req.session.user, _user_id: req.session.user_id
	});
});
router.get('/office-details', isAuthenticated, (req, res) => {
	res.render('office-details.hbs', {
		_user : req.session.user, _user_id: req.session.user_id
	});
});
router.get('/users', isAuthenticated, (req, res) => {
	res.render('users.hbs', {
		tables_bs4: true, users: true, _user : req.session.user, _user_id: req.session.user_id
	});
});
router.get('/user-details/:userid/:act', isAuthenticated, async (req, res) => {
	const __data_pop_position = await getPopupData('position');
	const _userpass_guid = req.params.userid;
	res.render('users-details.hbs', {
		user_details: true, tables_bs4: true, __data_pop_position, _userpass_guid, _user : req.session.user, _user_id: req.session.user_id
	});
	
});
router.get('/clients', (req, res) => {
	res.render('clients.hbs', {
		tables_bs4: true, clients: true, _user : req.session.user, _user_id: req.session.user_id
	});
});

router.get('/client-details/:clientid/:act', isAuthenticated, async (req, res) => {
	const __data_pop_activity = await getPopupData('activity');
	const _client_guid = req.params.clientid;
	const __data_countries = _data_countries.data;
	res.render('client-details.hbs', {
		client_details: true, _client_guid, __data_pop_activity, tables_bs4: true, __data_countries, _user : req.session.user, _user_id: req.session.user_id
	});
	
});
router.get('/suppliers', isAuthenticated, (req, res) => {
	res.render('suppliers.hbs', {
		tables_bs4: true, suppliers: true, _user : req.session.user, _user_id: req.session.user_id
	});
});
router.get('/supplier-details/:suppid/:act', isAuthenticated, async (req, res) => {
	const __data_countries = _data_countries.data;
	const _supp_guid = req.params.suppid;
	const __data_pop_product_family = await getPopupData('product-family');
	res.render('supplier-details.hbs', {
		tables_bs4: true, _supp_guid, supplier_details:true, __data_countries, __data_pop_product_family, _user : req.session.user, _user_id: req.session.user_id
	});
	
});
router.get('/raw-materials', isAuthenticated, (req, res) => {
	res.render('raw-materials.hbs', {
		tables_bs4: true, raw_materials:true, _user : req.session.user, _user_id: req.session.user_id
	});
});
router.get('/raw-material-details/:rmid/:act', isAuthenticated, async (req, res) => {
	const _act = req.params.act
	const _rm_guid = req.params.rmid
	const __data_pop_product_family = await getPopupData('product-family');
	const __data_pop_kayu = await getPopupData('kayu');
	const __data_pop_unit = await getPopupData('unit');
	
	res.render('raw-material-details.hbs', {
		tables_bs4: true, raw_material_details:true,__data_pop_product_family,__data_pop_kayu, __data_pop_unit, _rm_guid, _act, _user : req.session.user, _user_id: req.session.user_id
	});
	
});
router.get('/stock', isAuthenticated, (req, res) => {
	res.render('stock.hbs', {
		_user : req.session.user, _user_id: req.session.user_id
	});
});
router.get('/logs', isAuthenticated, (req, res) => {
	res.render('logs.hbs', {
		tables_bs4: true, _user : req.session.user, _user_id: req.session.user_id
	});
});
router.get('/finish-product', isAuthenticated, (req, res) => {
	res.render('finish-product.hbs', {
		tables_bs4: true, finish_product: true, _user : req.session.user, _user_id: req.session.user_id
	});
});
router.get('/finish-product-details/:fpid/:act', isAuthenticated, async (req, res) => {
	const _act = req.params.act
	const _fpid = req.params.fpid
	// const __data_pop_product_family = _data_pop_product_family.data;
	const __data_pop_product_family = await getPopupData('product-family');
	const __data_pop_origin = await getPopupData('origin');
	res.render('finish-product-details.hbs', {
		tables_bs4: true, finish_product_details: true, __data_pop_product_family, __data_pop_origin, fpid:_fpid, act:_act, _user : req.session.user, _user_id: req.session.user_id
	});
});
router.get('/fpc/:fpid/:act', isAuthenticated, async (req, res) => {
	const _act = req.params.act
	const _fpid = req.params.fpid
	const __data_pop_unit = await getPopupData('unit');
	const __data_rm = await getRM();
	res.render('fpc.hbs', {
		tables_bs4: true, fpc:true, fp_guid:_fpid, act:_act, __data_pop_unit, __data_rm, _user : req.session.user, _user_id: req.session.user_id
	});
})
router.get('/fpc-details/:fpid/:fcpid/:act', isAuthenticated, async (req, res) => {
	// console.log('eid : '+req.params.eid);
	// YWRkbmV3 => addnew
	const __data_pop_unit = await getPopupData('unit');
	const _fpcid = req.params.fcpid
	const _fpid = req.params.fpid
	const _act = req.params.act
	res.render('fpc-details.hbs', {
		tables_bs4: true, fpc_details: true, fpid:_fpid, fpcid:_fpcid, __data_pop_unit, act:_act, _user : req.session.user, _user_id: req.session.user_id
	});
})
router.get('/sales-price-calc', isAuthenticated, (req, res) => {
	res.render('sales-price-calc.hbs', {
		tables_bs4: true, _user : req.session.user, _user_id: req.session.user_id
	});
});
router.get('/price-list', isAuthenticated, (req, res) => {
	res.render('price-list.hbs', {
		tables_bs4: true, _user : req.session.user, _user_id: req.session.user_id
	});
});
router.get('/exchange-rate', isAuthenticated, (req, res) => {
	res.render('exchange-rate.hbs', {
		_user : req.session.user, _user_id: req.session.user_id
	});
});
router.get('/stock-raw-materials', isAuthenticated, async (req, res) => {
	// const __data_stock_pop = await getRMFP('rm');
	res.render('stock-raw-materials.hbs', {
		tables_bs4: true, stock_raw_materials: true, _user : req.session.user, _user_id: req.session.user_id
	});
});
router.get('/stock-finish-products', isAuthenticated, async (req, res) => {
	// const __data_stock_pop = await getRMFP('fp');
	res.render('stock-finish-products.hbs', {
		tables_bs4: true, stock_finish_products: true, _user : req.session.user, _user_id: req.session.user_id
	});
});

router.get('/login', (req, res) => {
	res.render('login.hbs', {
		login: true
	});
});
// app.post('/login', express.urlencoded({ extended: false }), function (req, res) {
	
//   })
router.get('/logout', function (req, res, next) {
	// logout logic
  	// clear the user from the session object and save.
	// this will ensure that re-using the old session id
	// does not have a logged in user
	req.session.user = null
	req.session.save(function (err) {
	  if (err) next(err)
  
	  // regenerate the session, which is good practice to help
	  // guard against forms of session fixation
	  req.session.regenerate(function (err) {
		if (err) next(err)
		res.redirect('/login')
	  })
	})
  })
router.post('/auth', (req, res) => {
	// res.redirect('/')
	// console.log(validated);
	// res.json({validated})
	const _users = require("../public/data/login.json")
	const _login_req = req.body;
    const _res =  _users.data.find(item => {
        return item.email == _login_req.email && item.pass == _login_req.pass
     })

	// login logic to validate req.body.user and req.body.pass
	// would be implemented here. for this example any combo works
  
	// regenerate the session, which is good practice to help
	// guard against forms of session fixation
	req.session.regenerate(function (err) {
		if (err) next(err)
	
		// store user information in session, typically a user id
		if (_res) {
			req.session.user = _res.name//req.body.email
			req.session.user_id = _res.user_guid
		}else{}
		
	
		// save the session before redirection to ensure page
		// load does not happen before session is saved
		req.session.save(function (err) {
		  if (err) return next(err)
		  res.json({"success": (_res ? true : false)})
		})
	  })

});

//functions
function isAuthenticated (req, res, next) {
	if (req.session.user) next()
	else res.redirect('/login');//next('route')
  }
module.exports = router;
