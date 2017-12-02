var mongoose = require('mongoose');

var Todos = mongoose.model('Todos', {
  text: {
    type: String,
    require: true,
    minlength: 2,
    // maxlength: 8,
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

module.exports = {Todos};
