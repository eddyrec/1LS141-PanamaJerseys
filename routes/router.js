"use strict";
let express = require('express');
let router = express.Router();
let Cart = require('../models/cart');
let csrf = require('csurf');
let passport = require('passport');

let user = require('../models/user');
let usuarios = require('../models/usuarios');
let estados = require('../models/estados');
let productos = require('../models/productos');


let paypal = require('paypal-rest-sdk');
let csrfProtection = csrf();
router.use(csrfProtection);


// router.get('/', function(req, res){
// 	res.render('index');
// });

//
//
//		PRUEBA DE indexTEST
//
//
//router.get('/indexTEST', function(req, res, next){
router.get('/', function(req, res, next){
	let messages = req.flash('success');
	productos.find(function(err, docs){
		var productosChunk = [];
		var chunkSize = 3;
		for(var i = 0; i < docs.lenght; i +=chunkSize){
			productosChunk.push(docs.slice(i,i + chunkSize));
		}
		res.render('index', {
			tittle: 'Shopping Cart', 
			productos: docs,messages: messages, 
			hasSuccess: messages.length > 0});
	});
});

router.post('/add-to-cart/:id', function(req, res, next){
	var productoid = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : { });
	var tama = req.body.tamano;

	productos.findById(productoid, function(err, producto){
		if (err){
			return res.redirect('/');
		}
		cart.add(producto, producto.id,tama);
		req.session.cart = cart;
		console.log(req.session.cart);
		req.flash('success', 'El producto ha sido agregado satisfactoriamente');
		res.redirect('/producto/'+producto.id);
	})
});

router.get('/shopping-cart',isLoggedIn, function(req , res, next){
	if (!req.session.cart){
		return res.render('shopping-cart', {products:null});
	}
	var cart = new Cart(req.session.cart);
	res.render('shopping-cart', {csrfToken: req.csrfToken(),products: cart.generateArray(), totalPrice: cart.totalPrice})
});

router.get('/reduce/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});



router.post('/checkout', function(req, res, next){
	var cart = new Cart(req.session.cart);
	console.log("Carrito antes de Paypal");
	console.log(cart);
	const create_payment_json = {
		"intent": "sale",
		"payer": {
			"payment_method": "paypal"
		},
		"redirect_urls": {
			"return_url": "http://localhost:3000/success",
			"cancel_url": "http://localhost:3000/shopping-cart"
		},
		"transactions": [{
			"item_list": {
				"items": [{
					"name": "item",
					"sku": "item",
					"price": cart.totalPrice ,
					"currency": "USD",
					"quantity": 1}]
			},
			"amount": {
				"currency": "USD",
				"total": cart.totalPrice 
			},
			"description": "Pago de Camisetas."
		}]
	};


	paypal.payment.create(create_payment_json, function (error, payment) {
		if (error) {
			throw error;
		} else {
			for(let i = 0; i<payment.links.length;i++){
				if(payment.links[i].rel === 'approval_url'){
					res.redirect(payment.links[i].href);
				}
			}
			console.log("SUCCESS")
			console.log(cart)

			// var Estados = new estados ({

			// 	usuario: req.user.username,
			// 	correo: req.user.correo,
			// 	cart: cart,
			// 	direccion1:req.user.direccion1,
			// 	direccion2:req.user.direccion2,
			// 	orderstat:"En Espera",
			// 	ordernum:new Date().getTime(),
			// 	telefono:req.user.telefono
			// });
			// Estados.save(function(err, result){
			// 	req.session.cart = undefined;
			// })
			var onum = new Date().getTime();
			estados.insert(onum,"En Espera",cart,req.user.usuario,req.user.correo,req.user.direccion1,req.user.direccion2,req.user.telefono, function(error,user){
				if(error){
					console.log("s");
					next(error);}
				else if(user){
					console.log("Error este");
					var err = new Error('orden ya existente');
					err.status = 401;
					next(err);}
				else{
					console.log("Puede ir Bien");
					req.session.cart=false;
					console.log("Vas Bien");
				}
					
			  });


			console.log(req.session.cart)
		}
	});

});

router.get('/success', function(req, res){
	let messages = req.flash('success');
	const payerId = req.query.PayerID;
	const paymentId = req.query.paymentId;
	var cart = req.session.cart;

	const execute_payment_json = {
		"payer_id":payerId,
		"transactions":[{
			"amount":{
				"currency": "USD",
				"total": cart.totalPrice
			}
		}]

	};


	paypal.payment.execute(paymentId,execute_payment_json, function (error, payment) {
		if (error) {
			throw error;
		} else {
			console.log("Create Payment Response");
			console.log("Success2");
			// req.session.cart = null;
			console.log(req.session.cart);
		}
	});

	res.render('success',{messages: messages, hasSuccess: messages.length > 0 });
});


router.get('/producto/:productoid', function(req, res){

	let messages = req.flash('success');
	var id= req.params.productoid;
    productos.findById(id)
    .exec()
    .then(result => {
			console.log(result)
        productos.find()
                .exec()
                .then(resultado2 => {
					console.log(resultado2)
                res.render('producto', {
                    producto: result,
					productos: resultado2,
					csrfToken: req.csrfToken(),
					messages: messages, 
					hasSuccess: messages.length > 0
                    
                })
            })
            }   
        ).catch(err => {
            res.status(500).json({
                error: err
            })
});
	
});

router.get('/quienessomos',function(req,res){
	res.render('quienessomos');


})
//REGISTRO

router.get('/registro', function(req, res){
	let messages = req.flash('error');
	res.render('registro',{csrfToken: req.csrfToken(),messages: messages, hasErrors: messages.length > 0 });
});

router.post('/registroU', passport.authenticate('local.signup',{
	successRedirect: '/registro',
	failureRedirect: '/registro',
	failureFlash: true
}));


//LOGIN
router.get('/login',notLoggedIn, function(req, res){
	let messages = req.flash('error');
	res.render('login',{csrfToken: req.csrfToken(),messages: messages, hasErrors: messages.length > 0 });
});

router.get('/logout',isLoggedIn, function(req,res,next){
	req.session.destroy();
	req.logout();
	res.redirect('/')
});


router.post('/login', passport.authenticate('local.signin',{
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
}));



// CARRITO





//PERFIL

router.get('/perfil', isLoggedIn, function(req, res, next){

	let messages = req.flash('error');
	 
	estados.find({usuario:req.user.usuario}, function(error,Estados){
		if(error){
			return res.write("error")
		}
		var cart;
		Estados.forEach(function(Estados){
			cart = new Cart(Estados.cart);
			Estados.items = cart.generateArray();
		});
		
		res.render('perfil',{
		
			usuario:req.user.usuario,
			nombre:req.user.nombre,
			apellido:req.user.apellido,
			 usuario:req.user.usuario,
			password:req.user.password,
			correo:req.user.correo,
			sexo:req.user.sexo,
			direccion1:req.user.direccion1,
			direccion2:req.user.direccion2,
			telefono:req.user.telefono,
			messages: messages, 
			Estados:Estados,
			hasErrors: messages.length > 0,
			csrfToken: req.csrfToken()
		
		});

	});


	
});

router.post('/editarP', isLoggedIn, function(req, res, next){
usuarios.findById(req.user.id, function (err, user) {

	// todo: don't forget to handle err

	if (!user) {
		 req.flash('error', 'No account found');
		return res.redirect('/perfil');
	}

	// good idea to trim 
	var email = req.body.correo.trim();
	var sexo = req.body.sexo.trim();
	var firstname = req.body.nombre.trim();
	var lastname = req.body.apellido.trim();
	var password = req.body.password.trim();
	var direccion1 = req.body.direccion1.trim();
	var direccion2 = req.body.direccion2.trim();
	var telefono = req.body.telefono.trim();



	// validate

	if (!email || !sexo || !firstname || !lastname || !password|| !direccion1 || !telefono) { // simplified: '' is a falsey
		req.flash('error', 'One or more fields are empty');
		 return res.redirect('/perfil'); // modified
	}

	// no need for else since you are returning early ^
	user.correo = email;
	user.sexo = sexo; // why do you have two? oh well
	user.nombre = firstname;
	user.apellido = lastname;
	user.password = password;
	user.direccion1 = direccion1;
	user.direccion2 = direccion2;
	user.telefono = telefono;

	// don't forget to save!
	user.save(function (err) {

		// todo: don't forget to handle err

		res.redirect('/perfil');
	});
});
});


//ADMINUSR
router.get('/adminusr',isLoggedIn,isAdmin,function(req, res, next){
	// if(!req.session.usuario){
	// 	res.redirect('/login');
	// }
	// else 
	// res.render('adminusr',{usuario:req.session.usuario, modelo:user});
	usuarios.findAll(function(error,users){
		if(error)
			next(error);
		else if(!users)
			users = [];
		else
			res.render('adminusr',{csrfToken: req.csrfToken(),usuario:req.user.usuario, modelo:users});
	}); 
});

//INSERTAR
router.post('/insertar', function(req, res, next){
	usuarios.insert(req.body.nombre,req.body.apellido,req.body.usuario,req.body.password,req.body.correo,req.body.sexo,req.body.direccion1,req.body.direccion2,req.body.telefono,req.body.admin, function(error,user){
		if(error)
			next(error);
		else if(user){
			var err = new Error('usuario ya existente');
			err.status = 401;
			next(err);}
		else
			res.redirect('/adminusr');
	  });
});

// ACTUALIZAR
router.post('/actualizar', function(req, res, next){
	usuarios.update(req.body.nombre,req.body.apellido,req.body.usuario,req.body.password,req.body.correo,req.body.sexo,req.body.direccion1,req.body.direccion2,req.body.telefono,req.body.admin, function(error,msg){
		console.log(req.body.usuario);
		if(error)
			next(error);
		else if(!msg){
			var err = new Error('Usuario no existe');
			err.status = 401;
			next (err);}
		res.redirect('/adminusr');
		
	  });
});

// //ELIMINAR
router.post('/eliminar', function(req, res, next){
	usuarios.delete(req.body.usuario, function(error,msg){
		if(error)
			next(error);
		else if(msg){
			var err = new Error('usuario no existe');
			err.status = 401;
			next(err);
		}
		else{
			console.log('exito');
			res.redirect('/adminusr');}
	  });
});


//ESTATUS PEDIDO cambiar Todo donde dice users
router.get('/adminstatus',isLoggedIn,function(req, res, next){
	// if(!req.session.usuario){
	// 	res.redirect('/login');
	// }
	// else 
	// res.render('adminusr',{usuario:req.session.usuario, modelo:user});
	estados.findAll(function(error,users){
		if(error)
			next(error);
		else if(!users)
			users = [];
		else
		// req.session.usuario = usuarios.username;
			res.render('adminstatus',{csrfToken: req.csrfToken(),usuario:req.user.usuario, modelo:users});
	}); 
});

//INSERTAR
router.post('/insertarP', function(req, res, next){
	estados.insert(req.body.ordernum,req.body.orderstat,req.body.orderdate,req.body.usuario,req.body.correo,req.body.direccion1,req.body.direccion2,req.body.telefono, function(error,user){
		if(error)
			next(error);
		else if(user){
			var err = new Error('orden ya existente');
			err.status = 401;
			next(err);}
		else
			res.redirect('/adminstatus');
	  });
});

// ACTUALIZAR
router.post('/actualizarP', function(req, res, next){
	estados.update(req.body.ordernum,req.body.orderstat,req.body.usuario,req.body.correo,req.body.direccion1,req.body.direccion2,req.body.telefono, function(error,msg){
		console.log(req.body.ordernum);
		if(error)
			next(error);
		else if(!msg){
			var err = new Error('Orden no existe');
			err.status = 401;
			next (err);}
		res.redirect('/adminstatus');
		
	  });
});

// //ELIMINAR
router.post('/eliminarP', function(req, res, next){
	estados.delete(req.body.ordernum, function(error,msg){
		if(error)
			next(error);
		else if(msg){
			var err = new Error('orden no existe');
			err.status = 401;
			next(err);
		}
		else{
			console.log('exito');
			res.redirect('/adminstatus');}
	  });
});


//ADMINISTRACION DE INVENTARIO//
//ADMIN INV

router.get('/admin_inv',isLoggedIn,isAdmin,function(req, res, next){

	productos.findAll(function(error,producto){
		if(error)
			next(error);
		else if(!producto){
			producto = [];
			console.log("MAL");}
		else
			res.render('admin_inv',{csrfToken: req.csrfToken(),usuario:req.user.usuario, modelo:producto});
	}); 
});

//INSERTAR INV
router.post('/insertarI', function(req, res, next){
	productos.insert(req.body.imagePath,req.body.titulo,req.body.descripcion,req.body.cantidad,req.body.precio,req.body.liga,req.body.talla, function(error,user){
		if(error)
			next(error);
		else if(user){
			var err = new Error('producto ya existente');
			err.status = 401;
			next(err);}
		else
			res.redirect('/admin_inv');
	  });
});

// ACTUALIZAR INV
router.post('/actualizarI', function(req, res, next){
	productos.update(req.body.imagePath,req.body.titulo,req.body.descripcion,req.body.cantidad,req.body.precio,req.body.liga,req.body.talla, function(error,msg){
		console.log(req.body.imagePath);
		if(error)
			next(error);
		else if(!msg){
			var err = new Error('producto no existe');
			err.status = 401;
			next (err);}
		res.redirect('/admin_inv');
		
	  });
});

// //ELIMINAR INV
router.post('/eliminarI', function(req, res, next){
	productos.delete(req.body.imagePath, function(error,msg){
		if(error)
			next(error);
		else if(msg){
			var err = new Error('producto no existe');
			err.status = 401;
			next(err);
		}
		else{
			console.log('exito');
			res.redirect('/admin_inv');}
	  });
});


/////////////////FUNCIONES DE LOCK ROUTES///////////////////////

function isLoggedIn (req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login')
}


function notLoggedIn (req, res, next){
	if(!req.isAuthenticated()){
		return next();
	}
	res.redirect('/')
}

function isAdmin (req, res, next){
	if(req.user.admin ==='admin'){
		return next();
	}
	res.redirect('/perfil')
}

router.get('*', function(req, res){
	res.status(404).render('error404');
});





module.exports = router;