const express = require('express');
const app = express();
const router = express.Router();
// const tsqlPull = require('../tsql/pull');
//fs = require('fs');
const axios = require('axios');
const fetch = require('node-fetch');
const _api_url_default = 'http://localhost:3000'

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
		tables_bs4: true
	});
});
router.get('/invoice', (req, res) => {
	res.render('invoice.hbs', {
		tables_bs4: true
	});
});
router.get('/purchase', (req, res) => {
	res.render('purchase.hbs', {
		tables_bs4: true
	});
});
router.get('/production', (req, res) => {
	res.set('Cache-Control', 'max-age=31536000');
	res.render('production.hbs', {
		// flot: true
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
router.get('/user-details', (req, res) => {
	res.render('users-details.hbs', {
		add_new: true
	});
	
});
router.get('/clients', (req, res) => {
	res.render('clients.hbs', {
		tables_bs4: true, clients: true
	});
});

router.get('/client-details', (req, res) => {
	// const _data_opp_act = {data: [{val:"Other"},{val:"Other 1"},{val:"Other 2"}]};
	// res.render('client-details.hbs', {
	// 	client_details: true, data_select, tables_bs4: true
	// });
	
	fetch(_api_url_default+'/data/pop-activity.json', {
		method: 'GET'
	})
	.then(res => res.json())
	.then(json => {
		// Do something...
		const _data_opp_act = json;
		// console.log(json);
		res.render('client-details.hbs', {
			client_details: true, _data_opp_act, tables_bs4: true
		});
	})
	.catch(err => console.log(err));
	
});
router.get('/suppliers', (req, res) => {
	res.render('suppliers.hbs', {
		tables_bs4: true, suppliers: true
	});
});
router.get('/supplier-details', (req, res) => {
	//const data_select = {data: [{val:"Finishing"},{val:"Object"},{val:"Mix"},{val:"Handicraft"},{val:"Box"}]};
	axios.get(_api_url_default+'/data/pop-product-family.json')
	.then(function(_data_select){
		const __data_pop_family = _data_select.data;
		res.render('supplier-details.hbs', {
			tables_bs4: true, supplier_details:true, __data_pop_family
		});
	})
	
});
router.get('/raw-materials', (req, res) => {
	res.render('raw-materials.hbs', {
		tables_bs4: true, raw_materials:true
	});
});
router.get('/raw-material-details', (req, res) => {

	axios.get(_api_url_default+'/data/pop-product-family.json')
	.then(function(_data){
		const __data_pop_family = _data.data;
		axios.get(_api_url_default+'/data/pop-kayu.json')
		.then(function(_data1){
			const __data_pop_kayu = _data1.data;
			res.render('raw-material-details.hbs', {
				tables_bs4: true, raw_material_details:true,__data_pop_family,__data_pop_kayu
			});
		})
		
		
	})

	

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
		tables_bs4: true
	});
});
router.get('/finish-product-details', (req, res) => {
	res.render('finish-product-details.hbs', {
		tables_bs4: true
	});
});
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
router.get('/stock-raw-materials', (req, res) => {
	res.render('stock-raw-materials.hbs', {
		tables_bs4: true
	});
});
router.get('/stock-finish-products', (req, res) => {
	res.render('stock-finish-products.hbs', {
		tables_bs4: true
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
