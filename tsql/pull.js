const db = require('../config/db');
const helper = require('../config/helper');
const config = require('../config/config');

async function _getdata(tbl, page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT * 
    FROM ` & tbl &` LIMIT ?,?`, 
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}

module.exports = {
  _getdata
}