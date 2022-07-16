const express = require('express');
const path = require('path');
const hbs = require('hbs');
const web = require('./routes/web');

const app = express();

// hbs.registerPartials("./views/partials");
hbs.registerPartials(path.join(__dirname, 'views/partials'));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static("./public"));
app.use('/', web);

//The 404 Route (ALWAYS Keep this as the last route)
app.use('*', function(req, res){
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