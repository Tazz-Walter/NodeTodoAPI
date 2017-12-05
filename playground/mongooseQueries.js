
const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todos} = require('./../server/models/todo');
const {Users} = require('./../server/models/user');

var id ='5a25fabc81f6de3a94dd89b5';
var idUser = '5a268b8f9038b896a1483670';

if (!ObjectID.isValid(id)) {
  console.log('Id not valid');
}

// Todos.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos con find', todos);
// });
//
// Todos.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todos con findOne', todo);
// });

Todos.findById(id).then((todo) => {
  if(!todo) {
    return console.log('Id not found');
  }

  console.log('Todos con findById', todo);
}).catch((e) => console.log('Error Handler Catch '+ e));

Users.findById(idUser).then((reg) => {
  if(!reg) {
    return console.log('Id not found for Users');
  }

  console.log('Users findById ', reg);
}).catch((e) => console.log('Error Handler Catch '+ e));
