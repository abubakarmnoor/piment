const express = require('express');
const path = require('path');
const hbs = require('hbs');
const web = require('./routes/web');
const apis = require('./routes/apis');
const app = express();
const axios = require('axios');

hbs.registerPartials(path.join(__dirname, 'views/partials'));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, 'public')));
app.use('/', web);
app.use('/apis/', apis);
app.get('/test/', (req, res)=>{
  let data = await sendGetRequest();
  res.status(200).json(data)

  
});

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


//function
const sendGetRequest = async () => {
  try {
      const resp = await axios.get('https://piment-admin.localpro100.com/apis/pop/product-family');
      console.log(resp.data);
  } catch (err) {
      // Handle Error Here
      console.error(err);
  }
};
// app.listen(1337, () => {
// 	console.log('http://localhost:1337');
// });
const PORT = process.env.PORT || 8000;
const link = `http://localhost:${ PORT }`;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ link }`);
});