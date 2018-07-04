"use strict";
// IMPORTANTE crear la base de datos con: use nombredelabd
// si no crean la base de datos como primer paso la coleccion se creara en test que es la db por defecto de mongo
// en mi caso usare:  'use aprendiendo'

db.createUser({user:'admin',pwd:'@admin01',roles:[{role:'readWrite',db:'panamaj'}]});
//db.auth('Nicole','nickyeslobest');   [por si algun dia necesitamos usar Authetication]
// NO CREAR ESTE USUARIO MAS DE 1 VEZ
//admin01 psw
db.createCollection('users');
db.users.insertOne({
    email:'admin@admin.com',
    username:'admin',
    password:'$2y$12$yg9uielaa8Y24BxoUO9O2.FvKH8AWbiFOr.iS0oEO4ohyWVwhhZQ.',
    passConfirm:'$2y$12$yg9uielaa8Y24BxoUO9O2.FvKH8AWbiFOr.iS0oEO4ohyWVwhhZQ.'
});
// Para hacer un query a la bd y probar que funciona pueden hacer
// db.estudiantes.find({}).pretty()
// esto es equivalente a el clasico 'Select * from estudiantes'
// el pretty al final es opcional
// Para conectarse a la base de datos como Nicole '$mongo -u Nicole -p' esto les pedira la contrasena
