const mongoose = require("mongoose");
//agregando validator primero npm install validator y luego aca para poder usarlo
// con esto podemos usar validator para validar email entre otras cosas
const validator = require('validator');

mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/NuevaApp'); deprecated
//otra forma de conectar
// var promise = mongoose.createConnection('mongodb://localhost:27017/NuevaApp', {
//   useMongoClient: true,
//   /* other options */
// });
// promise.then(function(db) {
//    // Use `db`, for instance `db.model()`
// });
mongoose.connect('mongodb://localhost:27017/TodoApp', {
  useMongoClient: true
});

module.exports = {mongoose, validator};
