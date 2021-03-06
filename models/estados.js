"use strict";
const mongoose = require('mongoose');


 var estadosSchema = new mongoose.Schema({
    ordernum: { type: String, unique: false, required: true, trim: true },
    orderstat: { type: String, unique: false, required: true, trim: true },
    cart: { type:Object, required: true },
    usuario: { type: String, unique: false, required: true, trim: true},
    correo: { type: String, unique: false, required: true, trim: true },
    direccion1: { type: String, unique: false, required: true, trim: true },
    direccion2: { type: String, unique: false, required: false, trim: true },
    telefono: { type: String, unique: false, required: false, trim: true },
},{collection:'Estados'});


estadosSchema.statics.findAll = function(callback){
    Estados.find({},function(err,users) {
        if(err)
            return callback(err);
        else if(!users)
            return callback();
        return callback(null,users);
    })
}

estadosSchema.statics.insert = function(ordernum,orderstat,cart,usuario,correo,direccion1,direccion2,telefono,callback){
    Estados.findOne({usuario:usuario},'usuario',function(err,user){
        if(err){
            return callback(err)
        }
        else if(user){
            return callback(user);
        }
        else{
            var data={
                ordernum:ordernum,
                orderstat:orderstat,
                cart:cart,
                usuario:usuario,
                correo:correo,
                direccion1:direccion1,
                direccion2:direccion2,
                telefono:telefono};
            Estados.create(data,function(err){
                if(err)
                    return callback(err);
                return callback();
            })}
    })   
}
estadosSchema.statics.update = function(ordernum,orderstat,usuario,correo,direccion1,direccion2,telefono,callback){
    Estados.findOne({ordernum:ordernum},'ordernum orderstat usuario correo direccion1 direccion2 telefono',function(err,user){
        if(err)
            return callback(err);
        else if(!user){
            console.log(user);
            return callback();
        }
        else{
                if(ordernum)
                    user.ordernum = ordernum;
                if(orderstat)
                    user.orderstat = orderstat;
                    
                if(usuario)
                    user.usuario = usuario;
                if(correo)
                    user.correo = correo;
                if(direccion1)
                    user.direccion1 = direccion1;
                if(direccion2)
                    user.direccion2 = direccion2;
                if(telefono)
                    user.telefono = telefono;
                user.save(function(err){
                    if(err)
                        return callback(err);
                    return callback(null,true);
                });
            }
    })   
}

estadosSchema.statics.delete = function(ordernum,callback){
    Estados.findOne({ordernum:ordernum},'ordernum',function(err,users){
        if(err)
            return callback(err);
        else if(!users)
            return callback(null,'ordernum no existe');
        Estados.deleteOne({ordernum:ordernum}, function(err){
                if(err)
                    return callback(err);
                return callback();//Success
            });
    })   
}

let Estados = mongoose.model('Estados',estadosSchema);

module.exports = Estados;

