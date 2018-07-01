
let express = require('express');
let router = express.Router();
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


router.get('/greet/:name', function(req, res){
	res.render('greetAPerson', {
		name: req.params.name,
	});
});

module.exports = router;