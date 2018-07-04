"use strict";
// IMPORTANTE crear la base de datos con: use nombredelabd
// si no crean la base de datos como primer paso la coleccion se creara en test que es la db por defecto de mongo
// en mi caso usare:  'use aprendiendo'

db.createUser({user:'admin',pwd:'admin01',roles:[{role:'readWrite',db:'panamajs'}]});
//db.auth('Nicole','nickyeslobest');   [por si algun dia necesitamos usar Authetication]
// NO CREAR ESTE USUARIO MAS DE 1 VEZ
//admin01 psw
db.createCollection('users');
db.users.insertOne({
    email:'admin@admin.com',
    username:'admin',
    password:'$2a$10$Vx1ebU4cswwEh8vn0MB7leXKvCJJA10UT.XJhbZhvPjNwwbni44yC',
    passConfirm:'$2a$10$Vx1ebU4cswwEh8vn0MB7leXKvCJJA10UT.XJhbZhvPjNwwbni44yC'
});
// Para hacer un query a la bd y probar que funciona pueden hacer
// db.estudiantes.find({}).pretty()
// esto es equivalente a el clasico 'Select * from estudiantes'
// el pretty al final es opcional
// Para conectarse a la base de datos como Nicole '$mongo -u Nicole -p' esto les pedira la contrasena
