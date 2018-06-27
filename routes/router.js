
let express = require('express');
let router = express.Router();
// Routes
router.get('/', function(req, res){
	res.render('index');
});

router.get('/greet/:name', function(req, res){
	res.render('greetAPerson', {
		name: req.params.name,
	});
});

module.exports = router;