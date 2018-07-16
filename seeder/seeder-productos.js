var Producto = require('../models/productos');

var mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost:27017/panamajs');
var url = 'mongodb://localhost:27017/panamajs';
mongoose.connect(url,{ useNewUrlParser: true });
var db = mongoose.connection;

var productos = [
    new Producto({
    imagePath: '/images/test_camiseta.jpg',
    titulo: 'Camiseta Real Madrid',
    descripcion: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!',
    cantidad: '15',
    precio: '24.99',
    liga: 'Española',
    talla: 'S',
}),
new Producto({
    imagePath: '/images/test_camiseta_germany.PNG',
    titulo: 'Camiseta Alemania',
    descripcion: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!',
    cantidad: '20',
    precio: '24.99',
    liga: 'Alemana',
    talla: 'S',
}),
new Producto({
    imagePath: '/images/test_camiseta_barcelona.PNG',
    titulo: 'Camiseta Barcelona',
    descripcion: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!',
    cantidad: '15',
    precio: '24.99',
    liga: 'Española',
    talla: 'S',
}),
new Producto({
    imagePath: '/images/test_camiseta_spain.PNG',
    titulo: 'Camiseta España',
    descripcion: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!',
    cantidad: '15',
    precio: '24.99',
    liga: 'Española',
    talla: 'S',
}),
new Producto({
    imagePath: '/images/test_camiseta_bayern.PNG',
    titulo: 'Camiseta Bayern München',
    descripcion: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!',
    cantidad: '10',
    precio: '24.99',
    liga: 'Alemana',
    talla: 'S',
}),
new Producto({
    imagePath: '/images/test_camiseta_croatia.PNG',
    titulo: 'Camiseta Croacia',
    descripcion: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!',
    cantidad: '15',
    precio: '24.99',
    liga: 'Croata',
    talla: 'S',
}),

];
var done = 0;
for (var i = 0; i <productos.lenght; i++){
    Productos[i].save(function(err, result){
        done++;
        if(done === productos.lenght){
            exit();
        }
    });
}

function exit(){
    db.diconnect();
}