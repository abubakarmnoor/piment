const axios = require('axios').default;
require('dotenv').config()
const api_url = process.env.API_URL;
const getPopupData = async () => {
try {

    const resp = await axios.get(api_url+'/apis/pop/product-family');
    return JSON.parse(JSON.stringify(resp.data));
        // console.log(resp.data);
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};
module.exports = {getPopupData};