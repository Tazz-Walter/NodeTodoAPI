var mongoose = require('mongoose');
//constructor
var Todos = mongoose.model('Todos', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 20,
    trim: true // elimina los espacios en blanco antes y despues del texto.
  },
  completed: {
    type: Boolean,
     default: 'False'
  },
  completedAt: {
    type: Number,
    default: null
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
}, 'Todos');
//volviendo a agregar Todos al final se especifica a mongoose q queremos esta
//tabla sino lo pasa atraves de formaters y te lo pasa a minuscula y agrega una
//"s" al final

module.exports = {Todos};
