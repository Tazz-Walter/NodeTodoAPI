var mongoose = require('mongoose');
var validator = require('validator');
//homework
// new collection Users with email and validations for email
//require- trim it -set type- minlength
var Users = mongoose.model('Users', {
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true, // elimina los espacios en blanco antes y despues del texto.
    unique: true,
    validate: {
      isAsync: false,
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  }
});

// var newUsers = new Users({
//   email: 'walter'
// });
//
// newUsers.save().then((doc) =>{
//   console.log('Saved to' + doc);
// }, (err) => {
//   console.log("Unable to save.. error: " + err);
// });
module.exports = {Users};
