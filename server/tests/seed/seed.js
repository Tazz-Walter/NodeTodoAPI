const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todos} = require('./../../models/todo');
const {Users} = require('./../../models/user');
//carga 2 registros de /todos
const registros = [{
  _id: new ObjectID(),
  text: 'First test todo'
},{
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333
}];
//devuelve la base de datos cargada
const populateTodos = (done) => {
  Todos.remove({}).then(() => {
    return Todos.insertMany(registros);
  }).then(() => done ());
};

//carga 2 usuarios
const userOneId= new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  _id: userOneId,
  email: 'walter123@gmail.com',
  password: 'password1',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
  }]
},{
  _id: userTwoId,
  email: 'alejandro1@gmail.com',
  password: 'password2'
}];

const populateUsers = (done) => {
  Users.remove({}).then(() => {
    var userOne = new Users(users[0]).save();
    var userTwo = new Users(users[1]).save();
    return Promise.all([userOne, userTwo]);
  }).then(() => done());
};


module.exports = {registros, populateTodos, users, populateUsers};
