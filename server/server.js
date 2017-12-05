const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todos} = require('./models/todo');
const {ObjectID} = require('mongodb');
// var {User} = require('./models/user');
// var {Datos} = require('./models/datos');

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
    console.log('hubo un error al querer grabar');
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


app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = {app};
