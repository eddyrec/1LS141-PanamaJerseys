"use strict";
let express = require('express');
let router = express.Router();
let csrf = require('csurf')
let passport = require('passport');

let user = require('../models/user');
let usuarios = require('../models/usuarios')
let estados = require('../models/estados')
let productos = require('../models/productos')


let csrfProtection = csrf();
router.use(csrfProtection);


router.get('/', function(req, res){
	res.render('index');
});


router.get('/producto', function(req, res){
	res.render('producto');
});


//REGISTRO

router.get('/registro', function(req, res){
	let messages = req.flash('error');
	res.render('registro',{csrfToken: req.csrfToken(),messages: messages, hasErrors: messages.length > 0 });
});

router.post('/registroU', passport.authenticate('local.signup',{
	successRedirect: '/login',
	failureRedirect: '/registro',
	failureFlash: true
}));


//LOGIN
router.get('/login',notLoggedIn, function(req, res){
	let messages = req.flash('error');
	res.render('login',{csrfToken: req.csrfToken(),messages: messages, hasErrors: messages.length > 0 });
});

router.get('/logout',isLoggedIn, function(req,res,next){
	req.logout();
	res.redirect('/')
});


router.post('/login', passport.authenticate('local.signin',{
	successRedirect: '/adminusr',
	failureRedirect: '/login',
	failureFlash: true
}));



//ADMINUSR
router.get('/adminusr',isLoggedIn,function(req, res, next){
	// if(!req.session.username){
	// 	res.redirect('/login');
	// }
	// else 
	// res.render('adminusr',{usuario:req.session.username, modelo:user});
	usuarios.findAll(function(error,users){
		if(error)
			next(error);
		else if(!users)
			users = [];
		else
			res.render('adminusr',{usuario:req.session.username, modelo:users});
	}); 
});

//INSERTAR
router.post('/insertar', function(req, res, next){
	usuarios.insert(req.body.nombre,req.body.apellido,req.body.usuario,req.body.password,req.body.correo,req.body.sexo,req.body.direccion1,req.body.direccion2,req.body.telefono, function(error,user){
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
	usuarios.update(req.body.nombre,req.body.apellido,req.body.usuario,req.body.password,req.body.correo,req.body.sexo,req.body.direccion1,req.body.direccion2,req.body.telefono, function(error,msg){
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
	// if(!req.session.username){
	// 	res.redirect('/login');
	// }
	// else 
	// res.render('adminusr',{usuario:req.session.username, modelo:user});
	estados.findAll(function(error,users){
		if(error)
			next(error);
		else if(!users)
			users = [];
		else
			res.render('adminstatus',{usuario:req.session.username, modelo:users});
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
	estados.update(req.body.ordernum,req.body.orderstat,req.body.orderdate,req.body.usuario,req.body.correo,req.body.direccion1,req.body.direccion2,req.body.telefono, function(error,msg){
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

//
//
//		PRUEBA DE indexTEST
//
//

router.get('/indexTEST', function(req, res, next){
	productos.find(function(err, docs){
		var productosChunk = [];
		var chunkSize = 3;
		for(var i = 0; i < docs.lenght; i +=chunkSize){
			productosChunk.push(docs.slice(i,i + chunkSize));
		}
		res.render('indexTEST', {tittle: 'Shopping Cart', productos: docs});
	});
});




module.exports = router;

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
	res.redirect('/adminusr')
}