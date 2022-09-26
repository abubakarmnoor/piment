module.exports = (req, res, next) => {
    const _users = require("../public/data/login.json")
	// console.log(req.body);
    const _login_req = req.body;
    // console.log(_users);
    // console.log(_login_req);
	const _res =  _users.data.find(item => {
        return item.email == _login_req.email && item.pass == _login_req.pass
     })
    //  console.log(_res);
     if (_res){
        // res.json({"succeess":true, logged_name:_res.name})
        next();
     }else{
        res.json({"success":false})
     }
    
}
