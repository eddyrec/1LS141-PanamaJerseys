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




let Productos = mongoose.model('Productos',productosSchema);

module.exports = Productos;