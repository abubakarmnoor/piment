module.exports = (req, res, next) => {
    // const _users = require("../public/data/login.json")
	console.log(req.body); ;
	
	// const name = _users.data[0].findIndex(email => email === emailx, pass => pass === passx);
	// return res.json({"msg":"123"});
    return next();
    return res.status(403).json({
        success: false,
        message: 'Invalid allowed origin'
    })
}