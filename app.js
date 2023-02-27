const express = require('express');
const path = require('path');
const hbs = require('hbs');
const web = require('./routes/web');
const apis = require('./routes/apis');
const app = express();

//helper
hbs.handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

// const axios = require('axios');
const { log } = require('console');
const {isAuthenticated} = require('./routes/functions')

hbs.registerPartials(path.join(__dirname, 'views/partials'));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, 'public')));
app.use('/', web);
app.use('/apis/', apis);
// app.get('/test/', async (req, res)=>{
//   let _res = await getPopupData('unit');
//   res.status(200).json(_res)
  
// });

//The 404 Route (ALWAYS Keep this as the last route)
app.use('*',isAuthenticated, function(req, res){
	res.render('404.hbs', {
		
	});
});
/* Error handler middleware */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({'message': err.message});
  
    return;
  });

// app.listen(1337, () => {
// 	console.log('http://localhost:1337');
// });
const PORT = process.env.PORT || 8000;
const link = `http://localhost:${ PORT }`;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ link }`);
});