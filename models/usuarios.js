"use strict";
const mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcrypt');


 var usuariosSchema = new mongoose.Schema({
    nombre: { type: String, unique: false, required: true, trim: true },
    apellido: { type: String, unique: false, required: false, trim: true },
    usuario: { type: String, unique: false, required: true, trim: true },
    password: { type: String, unique: false, required: true, trim: true },
    correo: { type: String, unique: false, required: true, trim: true },
    sexo: { type: String, unique: false, required: true, trim: true },
    direccion1: { type: String, unique: false, required: true, trim: true },
    direccion2: { type: String, unique: false, required: false, trim: true },
    telefono: { type: String, unique: false, required: false, trim: true },
    admin: { type: String, unique: false, required: false, trim: true, default:'user' },
},{collection:'usuarios'});


usuariosSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10),null);
};

usuariosSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

usuariosSchema.statics.findAll = function(callback){
    Usuarios.find({},function(err,users) {
        if(err)
            return callback(err);
        else if(!users)
            return callback();
        return callback(null,users);
    })
}

usuariosSchema.statics.insert = function(nombre,apellido,usuario,password,correo,sexo,direccion1,direccion2,telefono,admin,callback){
    Usuarios.findOne({usuario:usuario},'usuario',function(err,user){
        if(err){
            return callback(err)
        }
        else if(user){
            return callback(user);
        }
        else{
            var data={
                nombre:nombre,
                apellido:apellido,
                usuario:usuario,
                password:encryptPassword(password),
                correo:correo,
                sexo:sexo,
                direccion1:direccion1,
                direccion2:direccion2,
                telefono:telefono,
                admin:admin};
            Usuarios.create(data,function(err){
                if(err)
                    return callback(err);
                return callback();
            })}
    })   
}
usuariosSchema.statics.update = function(nombre,apellido,usuario,password,correo,sexo,direccion1,direccion2,telefono,admin,callback){
    Usuarios.findOne({usuario:usuario},'nombre apellido usuario password correo sexo direccion1 direccion2 telefono admin',function(err,user){
        if(err)
            return callback(err);
        else if(!user){
            console.log(user);
            return callback();
        }
        else{
                if(nombre)
                    user.nombre = nombre;
                if(apellido)
                    user.apellido=apellido;
                if(usuario)
                    user.usuario = usuario;               
                if(password)
                    user.password = user.encryptPassword(password);
                if(correo)
                    user.correo = correo;
                if(sexo)
                    user.sexo = sexo;
                if(direccion1)
                    user.direccion1 = direccion1;
                if(direccion2)
                    user.direccion2 = direccion2;
                if(telefono)
                    user.telefono = telefono;
                if(admin)
                    user.admin = admin;
                user.save(function(err){
                    if(err)
                        return callback(err);
                    return callback(null,true);
                });
            }
    })   
}

usuariosSchema.statics.delete = function(usuario,callback){
    Usuarios.findOne({usuario:usuario},'usuario',function(err,users){
        if(err)
            return callback(err);
        else if(!users)
            return callback(null,'usuario no existe');
        Usuarios.deleteOne({usuario:usuario}, function(err){
                if(err)
                    return callback(err);
                return callback();//Success
            });
    })   
}

let Usuarios = mongoose.model('Usuarios',usuariosSchema);

module.exports = Usuarios;

