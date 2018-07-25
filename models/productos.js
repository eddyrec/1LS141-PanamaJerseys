"use strict";
const mongoose = require('mongoose');


 var productosSchema = new mongoose.Schema({
    imagePath: { type: String, unique: false, required: true, trim: true },
    titulo: { type: String, unique: false, required: true, trim: true },
    descripcion: { type: String, unique: false, required: true, trim: true },
    cantidad: { type: String, unique: false, required: true, trim: true },
    precio: { type: Number, unique: false, required: true, trim: true },
    liga: { type: String, unique: false, required: true, trim: true },
    talla: { type: String, unique: false, required: false, trim: true },
},{collection:'Productos'});

productosSchema.statics.findAll = function(callback){
    Productos.find({},function(err,producto) {
        if(err)
            return callback(err);
        else if(!producto)
            return callback();
        return callback(null,producto);
    })
}

productosSchema.statics.insert = function(imagePath,titulo,descripcion,cantidad,precio,liga,talla,callback){
    Productos.findOne({imagePath:imagePath},'imagePath',function(err,producto){
        if(err){
            return callback(err)
        }
        else if(producto){
            return callback(producto);
        }
        else{
            var data={
                imagePath:imagePath,
                titulo:titulo,
                descripcion:descripcion,
                cantidad:cantidad,
                precio:precio,
                liga:liga,
                talla:talla};
            Productos.create(data,function(err){
                if(err)
                    return callback(err);
                return callback();
            })}
    })   
}
productosSchema.statics.update = function(imagePath,titulo,descripcion,cantidad,precio,liga,talla,callback){
    Productos.findOne({imagePath:imagePath},'imagePath titulo descripcion cantidad precio liga talla',function(err,producto){
        if(err)
            return callback(err);
        else if(!producto){
            console.log(producto);
            return callback();
        }
        else{
                if(imagePath)
                    producto.imagePath = imagePath;
                if(titulo)
                    producto.titulo=titulo;
                if(producto)
                    producto.descripcion = descripcion;               
                if(cantidad)
                    producto.cantidad = cantidad;
                if(precio)
                    producto.precio = precio;
                if(liga)
                    producto.liga = liga;
                if(talla)
                    producto.talla = talla;
                producto.save(function(err){
                    if(err){
                        console.log("aqui error")
                        return callback(err);}
                    return callback(null,true);
                });
            }
    })   
}

productosSchema.statics.delete = function(titulo,callback){
    Productos.findOne({titulo:titulo},'titulo',function(err,productos){
        if(err)
            return callback(err);
        else if(!productos)
            return callback(null,'producto no existe');
        Productos.deleteOne({producto:titulo}, function(err){
                if(err)
                    return callback(err);
                return callback();//Success
            });
    })   
}




let Productos = mongoose.model('Productos',productosSchema);

module.exports = Productos;