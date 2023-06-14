const axios = require('axios').default;
require('dotenv').config()
const api_url = process.env.API_URL;
const getPopupData = async (type) => {
try {
    const resp = await axios.get(api_url+'/apis/pop/'+type);
    return JSON.parse(JSON.stringify(resp.data.data));
        // console.log(resp.data);
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};
const getRM = async () => {
try {
    const resp = await axios.get(api_url+'/apis/pull/rm/');
    return JSON.parse(JSON.stringify(resp.data.data));
        // console.log(resp.data);
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};
const getFP = async () => {
    try {
        const resp = await axios.get(api_url+'/apis/pull/fp/');
        return JSON.parse(JSON.stringify(resp.data.data));
            // console.log(resp.data);
        } catch (err) {
            // Handle Error Here
            console.error(err);
        }
    };
const getClient = async () => {
try {
    const resp = await axios.get(api_url+'/apis/pull/client/');
    return JSON.parse(JSON.stringify(resp.data.data));
        // console.log(resp.data);
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};
const getRMFP = async (type) => {
    try {
    const resp = await axios.get(api_url+'/apis/pull/rmfp/');
    return JSON.parse(JSON.stringify(resp.data.data));
        // console.log(resp.data);
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};
function isAuthenticated (req, res, next) {
	// if (req.session.user) next()
	// else res.redirect('/login');//next('route')
    next()
}

module.exports = {getPopupData, getRM, getRMFP, getClient, isAuthenticated, getFP};