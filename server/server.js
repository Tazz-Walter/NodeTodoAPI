require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');

var {Todos} = require('./models/todo');
var {Users} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');
// var {Datos} = require('./models/datos');

var port = process.env.PORT;

var app = express();

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
  // console.log(req.body);
  var newTodo = new Todos({
    text: req.body.text,
    _creator: req.user._id
  });

  newTodo.save().then((doc) => {
    res.send(doc);
  }, (error) => {
    // console.log('hubo un error al querer grabar');
    res.status(400).send(error);
  });

});
//busca todos los registros
app.get('/todos', authenticate, (req, res) => {
  //solo va a devolver registros de la tabla Todos q solo hayan sido
  //generados por el usuario q esta logueado! muy bueno!
  Todos.find({
    _creator: req.user._id
  }).then((todos) =>{
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

// GET /todos/1234567 Url+ID
//busca por ID determinado
app.get('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todos.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => res.status(400).send());
});

//Borra por ID en /todos
app.delete('/todos/:id', authenticate, async (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  try {
    const todo = await Todos.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    });

    if(!todo) {
        return res.status(404).send();
      }
     res.status(200).send({todo});
   } catch (e) {
     res.status(400).send();
   }
});

//http patch resource
//nos permite actualizar todo Items
app.patch('/todos/:id', authenticate, (req, res) => {
  var id= req.params.id;
  //cramos la variable body con lo q nos actualiza el usuario
  //no queremos q nos actulize cualquier cosa
  var body = _.pick(req.body, ['text', 'completed']);
  //verificamos q sea valido el id
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  //verificamos q completed sea booleano y no cualquier cosa
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  //buscamos el id registro q vamos a actualizar
  //solo podremos actulizar aquellos creados por el mismo usuario
  //y lo actualizamos con los datos de body q estan revisados.
  Todos.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
      }, {
        $set: body
      }, {
        new: true
      }).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) =>{
    res.status(400).send();
  })
});

// POST /users with async-await instead of regular Promise
app.post('/users', async (req, res) => {
  try {
    const body = _.pick(req.body, ['email', 'password']);
    const user = new Users(body);
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// POST /user/login {email, password}
app.post('/users/login', async (req, res) => {
  try {
    //genera un token para el usuario q este en la base de datos
      const body = _.pick(req.body, ['email', 'password']);
      const user = await Users.findByCredentials(body.email, body.password);
      const token = await user.generateAuthToken();
      res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send();
  }
});

// GET /User con authenticate
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

//delete Token from users that are log in
app.delete('/users/me/token', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (e) {
      res.status(400).send();
  };
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
