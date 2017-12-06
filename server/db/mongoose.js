const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
//otra forma de conectar
// var promise = mongoose.createConnection('mongodb://localhost:27017/NuevaApp', {
//   useMongoClient: true,
//   /* other options */
// });

//work around para conectar con mlab
 let db = {
   localhost: 'mongodb://localhost:27017/TodoApp'
   // mlab: "mongodb://walter:walter@ds133166.mlab.com:33166/todos"
 }

//db.mlab work around de arriba.
// mongoose.connect(db.localhost || process.env.MONGODB_URI || db.mlab, {
mongoose.connect(db.localhost || process.env.MONGODB_URI, {
  useMongoClient: true
});

module.exports = {mongoose};
