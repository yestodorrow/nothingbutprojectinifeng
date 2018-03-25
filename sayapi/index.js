var express = require('express');
var router = require('./router');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')

var mongoose = require('mongoose');
var app = express();
app.engine('.tpl', require('ejs').__express);
app.set('view engine', 'tpl');
app.set('views', __dirname + '/template');

app.use(express.static('public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser('saygoodbye'));
app.use(router);

if(process.env.NODE_ENV == 'production')
	mongoose.connect('mongodb://dbuser:dbuser!%40%23123@127.0.0.1:27017/quicksay');
else
	mongoose.connect('mongodb://118.190.89.113/quicksay');	

var db = mongoose.connection;
db.once('open', function(){
	console.log('mongodb connection success...');
	})

app.listen(8002, function () {
	console.log('App listening on prot 8002');
});

