
const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todos} = require('./../server/models/todo');
const {Users} = require('./../server/models/user');

var id ='5a25fabc81f6de3a94dd89b5';
var idUser = '5a268b8f9038b896a1483670';

if (!ObjectID.isValid(id)) {
  console.log('Id not valid');
}
//formas de remover registros de la BD
// Todos.remove({}).then((result) => {
//   console.log(result);
// });

// Todos.findOneAndRemove({_id: 'asd123'}).then((todo) => {console.log(todo)});
Todos.findByIdAndRemove('5a26ce6b7f46532af4f3e9fa').then((todo)=>{console.log(todo)});
