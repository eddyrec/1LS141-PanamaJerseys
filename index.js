"use strict";
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let session = require('express-session'); 
let path = require('path');
let MongoStore = require('connect-mongo')(session);
let passport = require('passport');
let flash = require('connect-flash');
let cookieParser = require('cookie-parser');
let validator = require('express-validator');
let paypal = require('paypal-rest-sdk');

//Mongoose Connection 
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/panamajs?authDatabase=panamajs');
let db = mongoose.connection;

db.on('error',console.error.bind(console,'Error de Conexion: '));
db.once('open',() => {
	console.log('Connected to Mongo Database');
});

require('./config/passport');
// Setting View Engine

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// Middleware
app.use(express.static(path.join(__dirname, 'bower_components')))
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
	secret: 'work hard',
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({mongooseConnection: db}),
	cookie: {maxAge: 60 * 60 * 1000}
  }));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(function(req,res,next){
	  res.locals.login = req.isAuthenticated();
	  res.locals.session = req.session;
	  next();
  })

//PAYPAL

paypal.configure({
	'mode': 'sandbox', //sandbox or live
	'client_id': 'AWfZgRM-Mn79vGWtCx1QgT2H1_lYZPFxQLfaBHNYlrmba7HBxHujKIO-GRzjFLnmwhM1uXR6LWV91-nx',
	'client_secret': 'EGdlKQdcM5NrT8MtCde3Q4ycLBHWYJUMhQZxp2bFmHMOPrPEs4ExEkUx1iOnt-rwciT8KLro-MR-C0qa'
  });


// Routess

let routes = require('./routes/router');
app.use('/',routes);
app.use(function(req,res,next){
	let err = new Error('Archivo no encontrado');
	err.status=404;
	next(err);
});

// Open listening port
// Set PORT:
// Mac / Linux: export NODE_JS_PORT=3000
const port = process.env.NODE_JS_PORT || 3000;
app.listen(port, function(){ console.log(`Escuchando en el puerto ${port}...`) });