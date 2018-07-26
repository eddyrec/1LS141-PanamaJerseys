let passport = require('passport');
let Usuarios = require('../models/usuarios');
let LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done){
    done(null,user.id);           
});

passport.deserializeUser(function(id,done) {
    Usuarios.findById(id, function(err, user) {
        done(err,user);
        
    });
    
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'password',
    // nameField: 'nombre',
    // surnameField: 'apellido',
    // nameuserField: 'usuario',
    // sexField: 'sexo',
    // address1Field: 'direccion1',
    // address2Field: 'direccion2',
    // phoneField: 'telefono',
    passReqToCallback: true
}, function(req, correo, password,done){
    req.checkBody('correo','Correo Invalido').notEmpty().isEmail();
    req.checkBody('password','Password Invalido').notEmpty().isLength({min:6});
    req.checkBody('usuario','Usuario Invalido').notEmpty().isLength({min:3});
    var errors = req.validationErrors();
    if (errors) {
        let messages = [];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null,false, req.flash('error',messages));
    }
    Usuarios.findOne({'correo': correo}, function(err, user){
        if(err){
            return done(err);
        }
        if(user){
            return done(null, false, {message: 'El correo ya esta en uso'});
        }
        var newUsuarios = new Usuarios();
        newUsuarios.correo = correo;
        newUsuarios.nombre = req.param('nombre');
        newUsuarios.apellido = req.param('apellido');
        newUsuarios.usuario = req.param('usuario');
        newUsuarios.sexo = req.param('sexo');
        newUsuarios.direccion1 = req.param('direccion1');
        newUsuarios.direccion2 = req.param('direccion2');
        newUsuarios.telefono = req.param('telefono');
        newUsuarios.password = newUsuarios.encryptPassword(password);
        newUsuarios.save(function(err,result){
            if (err){
                return done(err);
            }
            return done(null, newUsuarios,{message: 'Registrado!'});
        });
    }) ;   

}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, correo, password,done){
    req.checkBody('correo','Correo Invalidos').notEmpty();
    req.checkBody('password','Password Invalido').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null,false, req.flash('error',messages));
    }

    Usuarios.findOne({'correo': correo}, function(err, user){
        if(err){
            return done(err);
        }
        if(!user){
            return done(null, false, {message: 'Usuario no Registrado'});
        }
        if (!user.validPassword(password)){
            return done(null, false, {message: 'Password Incorrecto'});
        }
      return done(null, user,);
    }) ;   

}));