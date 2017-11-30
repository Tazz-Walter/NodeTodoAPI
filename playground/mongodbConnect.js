//const MongoClient = require('mongodb').MongoClient;
//destructurando ES6 es una forma de generar variables apartir de objetos
//la linea de arriba se escribiria de la siguiente forma>
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) =>{
  if (err) {
    return console.log('Error connecting to mongoDB' + err);
  }
  console.log('Connected to Mongo DB!');
  // db.collection('Todos').insertOne({
  //   text: 'nuevo registro 1',
  //   completed: false
  // }, (err, result) => {
  //    if (err) {
  //      return console.log('Problemas al cargar nuevo registro' + err);
  //    }
  //    console.log(JSON.stringify(result.ops, undefined, 2));
  // });
  // homework! -> Insert new doc into Users (name, age, location)
  db.collection('Users').insertOne({
    name: 'Walter',
    age: 31,
    location: "Barrio nuevo 453",
    completed: false
  }, (err, result) => {
     if (err) {
       return console.log('Problemas al cargar nuevo registro' + err);
     }
     console.log(JSON.stringify(result.ops, undefined, 2));
     // para obtener el tiempo justo q se grabo el registro
     // console.log(result.ops[0]._id.getTimestamp());

  });

  db.close();
});
