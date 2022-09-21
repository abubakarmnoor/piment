const express = require('express');
const app = express();
const router = express.Router();
// const axios = require('axios').default;
const {getPopupData, getRM, getRMFP} = require('./functions')
// const tsqlPull = require('../tsql/pull');
//fs = require('fs');

const _data_countries = require("../public/data/countries.json");
// const _data_pop_activity = require("../public/data/pop-activity.json");
// const _data_pop_product_family = require("../public/data/pop-product-family.json");

// const _data_pop_kayu = require("../public/data/pop-kayu.json");

// const _data_pop_unit = require("../public/data/pop-unit.json");
// const _data_pop_creator = require("../public/data/pop-creator.json");
// const _data_pop_origin = require("../public/data/pop-origin.json");
// const _data_rm = require("../public/data/raw-materials.json");
// const _data_purchase = require("../public/data/purchase.json");


router.use(function (req, res, next) {
	//console.log('app use 123');
	res.set('Cache-Control', 'max-age=1');// 60s x 60m x24 x ? day
	next()
})
router.get('/', (req, res) => {
	res.render('index.hbs', {
		// morris: true
	});
});

router.get('/order-list', (req, res) => {
	res.render('order-list.hbs', {
		tables_bs4: true, order_list:true
	});
});
router.get('/order-list-details/:olid/:act', (req, res) => {
	const _act = req.params.act
	const _olid = req.params.olid
	res.render('order-list-details.hbs', {
		tables_bs4: true, order_list_details:true, olid:_olid, act:_act
	});
});

router.get('/invoice', (req, res) => {
	res.render('invoice.hbs', {
		tables_bs4: true
	});
});
router.get('/purchase', (req, res) => {
	res.render('purchase.hbs', {
		tables_bs4: true, purchase:true
	});
});
router.get('/purchase-details/:pid/:act', (req, res) => {
	const _act = req.params.act
	const _pid = req.params.pid
	res.render('purchase-details.hbs', {
		tables_bs4: true, purchase_details:true, _pid, _act
	});
});
router.get('/production', (req, res) => {
	res.set('Cache-Control', 'max-age=1');
	res.render('production.hbs', {
		tables_bs4: true, production:true
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
router.get('/office', (req, res) => {
	res.render('office.hbs', {
		tables_bs4: true
	});
});
router.get('/office-details', (req, res) => {
	res.render('office-details.hbs', {
		
	});
});
router.get('/users', (req, res) => {
	res.render('users.hbs', {
		tables_bs4: true, users: true
	});
});
router.get('/user-details/:userid/:act', async (req, res) => {
	const __data_pop_position = await getPopupData('position');
	const _userpass_guid = req.params.userid;
	res.render('users-details.hbs', {
		user_details: true, tables_bs4: true, __data_pop_position, _userpass_guid
	});
	
});
router.get('/clients', (req, res) => {
	res.render('clients.hbs', {
		tables_bs4: true, clients: true
	});
});

router.get('/client-details/:clientid/:act', async (req, res) => {
	const __data_pop_activity = await getPopupData('activity');
	const _client_guid = req.params.clientid;
	const __data_countries = _data_countries.data;
	res.render('client-details.hbs', {
		client_details: true, _client_guid, __data_pop_activity, tables_bs4: true, __data_countries
	});
	
});
router.get('/suppliers', (req, res) => {
	res.render('suppliers.hbs', {
		tables_bs4: true, suppliers: true
	});
});
router.get('/supplier-details/:suppid/:act', async (req, res) => {
	const __data_countries = _data_countries.data;
	const _supp_guid = req.params.suppid;
	const __data_pop_product_family = await getPopupData('product-family');
	res.render('supplier-details.hbs', {
		tables_bs4: true, _supp_guid, supplier_details:true, __data_countries, __data_pop_product_family
	});
	
});
router.get('/raw-materials', (req, res) => {
	res.render('raw-materials.hbs', {
		tables_bs4: true, raw_materials:true
	});
});
router.get('/raw-material-details/:rmid/:act', async (req, res) => {
	const _act = req.params.act
	const _rm_guid = req.params.rmid
	const __data_pop_product_family = await getPopupData('product-family');
	const __data_pop_kayu = await getPopupData('kayu');
	const __data_pop_unit = await getPopupData('unit');
	
	res.render('raw-material-details.hbs', {
		tables_bs4: true, raw_material_details:true,__data_pop_product_family,__data_pop_kayu, __data_pop_unit, _rm_guid, _act
	});
	
});
router.get('/stock', (req, res) => {
	res.render('stock.hbs', {
		// flot: true
	});
});
router.get('/logs', (req, res) => {
	res.render('logs.hbs', {
		tables_bs4: true
	});
});
router.get('/finish-product', (req, res) => {
	res.render('finish-product.hbs', {
		tables_bs4: true, finish_product: true
	});
});
router.get('/finish-product-details/:fpid/:act', async (req, res) => {
	const _act = req.params.act
	const _fpid = req.params.fpid
	// const __data_pop_product_family = _data_pop_product_family.data;
	const __data_pop_product_family = await getPopupData('product-family');
	const __data_pop_origin = await getPopupData('origin');
	res.render('finish-product-details.hbs', {
		tables_bs4: true, finish_product_details: true, __data_pop_product_family, __data_pop_origin, fpid:_fpid, act:_act
	});
});
router.get('/fpc/:fpid/:act', async (req, res) => {
	const _act = req.params.act
	const _fpid = req.params.fpid
	const __data_pop_unit = await getPopupData('unit');
	const __data_rm = await getRM();
	res.render('fpc.hbs', {
		tables_bs4: true, fpc:true, fp_guid:_fpid, act:_act, __data_pop_unit, __data_rm
	});
})
router.get('/fpc-details/:fpid/:fcpid/:act', async (req, res) => {
	// console.log('eid : '+req.params.eid);
	// YWRkbmV3 => addnew
	const __data_pop_unit = await getPopupData('unit');
	const _fpcid = req.params.fcpid
	const _fpid = req.params.fpid
	const _act = req.params.act
	res.render('fpc-details.hbs', {
		tables_bs4: true, fpc_details: true, fpid:_fpid, fpcid:_fpcid, __data_pop_unit, act:_act
	});
})
router.get('/sales-price-calc', (req, res) => {
	res.render('sales-price-calc.hbs', {
		tables_bs4: true
	});
});
router.get('/price-list', (req, res) => {
	res.render('price-list.hbs', {
		tables_bs4: true
	});
});
router.get('/exchange-rate', (req, res) => {
	res.render('exchange-rate.hbs', {
		// flot: true
	});
});
router.get('/stock-raw-materials', async (req, res) => {
	// const __data_stock_pop = await getRMFP('rm');
	res.render('stock-raw-materials.hbs', {
		tables_bs4: true, stock_raw_materials: true
	});
});
router.get('/stock-finish-products', async (req, res) => {
	// const __data_stock_pop = await getRMFP('fp');
	res.render('stock-finish-products.hbs', {
		tables_bs4: true, stock_finish_products: true
	});
});
//API - DB
// /* GET programming languages. */
// router.get('/getdata', async function(req, res, next) {
// 	try {
// 	  res.json(await tsqlPull.getMultiple(req.query.page));
// 	} catch (err) {
// 	  console.error(`Error while getting programming languages `, err.message);
// 	  next(err);
// 	}
// });

router.get('/login', (req, res) => {
	res.render('login.hbs', {
		morris: true
	});
});

//functions

module.exports = router;
