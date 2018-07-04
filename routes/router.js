
let express = require('express');
let router = express.Router();
let user = require('../models/user');
let estudiante = require('../models/estudiante')
// Routes
router.get('/', function(req, res){
	res.render('index');
});

router.get('/login', function(req, res){
	res.render('login');
});

router.get('/registro', function(req, res){
	res.render('registro');
});


router.get('/producto', function(req, res){
	res.render('producto');
});

router.get('/greet/:name', function(req, res){
	res.render('greetAPerson', {
		name: req.params.name,
	});
});

module.exports = router;