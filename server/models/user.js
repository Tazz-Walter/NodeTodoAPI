const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

// constructor de Objectos y en estos objectos
// podemos creaer metodos instantaneos
var UserSchema = new mongoose.Schema({
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
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    tokens: [{
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required:true
      }
    }]
});

//overiding methods so we not send info data like password and tokens array
//toJSON determina q es enviado de vuelta
UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email']);
};

//Metodo instantaneo del constructor
UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({
    _id: user._id.toHexString(),
    access
  }, 'abc123').toString();
  //guarda en user.token access y token generados
  user.tokens.push({access, token});
  // user.save() devuelve una promesa,dentro devolvemos el token
  //tenemos una promesa dentro de otra q devuelve el token
  return user.save().then(() => {
    return token;
  });
};
//Metodo instantaneo para borrar token de usuarios logueados
UserSchema.methods.removeToken = function (token) {
  var user = this;
  //$pull te deja remover de un array segun matchee al criterio en este caso
  //removeremos del array de tokens el token dado
  return user.update({
    $pull :{
      tokens : {
        token: token
      }
    }
  });
};

//buscamos usuario en la base de datos por email. vamos a matchear
//password en texto plano contra el hash de la base de datos con bcryptjs
//Metodos estaticos
UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;
  return User.findOne({email}).then((user) => {
    if(!user){
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {//si es son iguales
            resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

//Find User by tokens
UserSchema.statics.findByToken = function (token) {
  // metodos instantaneos usan minuscula q llama a modelos individuales
  //methods models se usan con mayusculas y bindean el modelo
  var User= this;
  var decoded;
  try {
    decoded = jwt.verify(token, 'abc123')
  } catch (e) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    //hace lo mismo de arriba pero mas simple
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access' : 'auth'
  });
}
// Realiza un hash del password antes de guardar en la base de datos.
//Existe el .pre y el .post Por ejemplo para guardar o cerrar algo luego
//de una accion a la base de datos
UserSchema.pre('save', function (next) {
  var user = this;
  if (user.isModified('password')) {
      //encriptamos con bcryptjs
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
          user.password = hash;
          next();
        });
      });
  } else {
    next();
  }
});

var Users = mongoose.model('Users', UserSchema, 'Users');

module.exports = {Users};
