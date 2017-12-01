const mongoose = require("mongoose");

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
mongoose.connect('mongodb://localhost:27017/NuevaApp', {
  useMongoClient: true
});

var Datos = mongoose.model('Datos', {
  text: {
    type: String
  },
  completed: {
    type: Boolean
  },
  completedAt: {
    type: Number
  }
});

var newDatos2 = new Datos({
  text: 'Walterrrr ea ea',
  completed: true,
  completedAt: 1234
});

newDatos2.save().then((doc) =>{
  console.log('Saved to' + doc);
}, (err) => {
  console.log(`Unable to save.. error: $(err)`);
});
