var express = require('express');
var bodyParser = require('body-parser');

var {mongoose, validator} = require('./db/mongoose');
var {Todos} = require('./models/todo');
var {User} = require('./models/user');
var {Datos} = require('./models/datos');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  // console.log(req.body);
  var newTodo = new Todos({
    text: req.body.text
  });

  newTodo.save().then((doc) => {
    res.send(doc);
  }, (error) =>{
    res.status(400).send(error);
  });

});

app.listen(3000, () => {
  console.log('Started on port 3000');
});
