var mongoose = require('mongoose');

//agregando schemas validation
var Datos = mongoose.model('Datos', {
  text: {
    type: String,
    require: true,
    minlength: 2,
    maxlength: 8,
    trim: true // elimina los espacios en blanco antes y despues del texto.
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});
//  ejemplos insertando registros
// var newDatos2 = new Datos({
//   text: 'Walterrrr ea ea',
//   completed: true,
//   completedAt: 1234
// });
//
// newDatos2.save().then((doc) =>{
//   console.log('Saved to' + doc);
// }, (err) => {
//   console.log(`Unable to save.. error: $(err)`);
// });
module.exports = {Datos};
