const express = require('express');
const app = express();
const router = express.Router();
const tsqlPull = require('../tsql/pull');
//fs = require('fs');
const axios = require('axios');
// const _api_url_default = 'http://localhost:3000'
const _data_countries = require("../public/data/countries.json");
const _data_pop_activity = require("../public/data/pop-activity.json");
const _data_pop_product_family = require("../public/data/pop-product-family.json");
const _data_pop_kayu = require("../public/data/pop-kayu.json");
const _data_pop_unit = require("../public/data/pop-unit.json");
const _data_pop_creator = require("../public/data/pop-creator.json");
const _data_pop_origin = require("../public/data/pop-origin.json");
const _data_rm = require("../public/data/raw-materials.json");
const _data_purchase = require("../public/data/purchase.json");

router.use(function (req, res, next) {
	res.set('Cache-Control', 'max-age=0');// 60s x 60m x24 x ? day
	next()
})
//API - DB
// /* GET programming languages. */
router.get('/getdata', async function(req, res, next) {
	try {
	  res.json(await tsqlPull._getdata(req.query.tbl, req.query.page));
	} catch (err) {
	  console.error(`Error while getting programming languages `, err.message);
	  next(err);
	}
});

//functions

module.exports = router;
