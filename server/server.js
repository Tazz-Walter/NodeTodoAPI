require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');

var {Todos} = require('./models/todo');
var {Users} = require('./models/user');
// var {Datos} = require('./models/datos');

var port = process.env.PORT;

var app = express();

app.use(bodyParser.json());

app.post('/Todos', (req, res) => {
  // console.log(req.body);
  var newTodo = new Todos({
    text: req.body.text
  });

  newTodo.save().then((doc) => {
    res.send(doc);
  }, (error) => {
    // console.log('hubo un error al querer grabar');
    res.status(400).send(error);
  });

});
//busca todos los registros
app.get('/todos', (req, res) => {
  Todos.find().then((todos) =>{
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

// GET /todos/1234567 Url+ID
//busca por ID determinado
app.get('/todos/:id',(req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todos.findById(id).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => res.status(400).send());
});

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todos.findByIdAndRemove(id).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }
    res.status(200).send({todo});
  }).catch((e) => res.status(400).send());

});

//http patch resource
//nos permite actualizar todo Items
app.patch('/todos/:id', (req, res) => {
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
  //y lo actualizamos con los datos de body q estan revisados.
  Todos.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(400).send();
    }
    res.send({todo});
  }).catch((e) =>{
    res.status(400).send();
  })
});

app.post('/Users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new Users(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((error) => {
    res.status(400).send(error);
  })
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
