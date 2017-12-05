const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
//otra forma de conectar
// var promise = mongoose.createConnection('mongodb://localhost:27017/NuevaApp', {
//   useMongoClient: true,
//   /* other options */
// });
mongoose.connect('mongodb://localhost:27017/TodoApp', {
  useMongoClient: true
});

module.exports = {mongoose};
