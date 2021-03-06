const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todos} = require('./../../models/todo');
const {Users} = require('./../../models/user');

//carga 2 usuarios
const userOneId= new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  _id: userOneId,
  email: 'walter123@gmail.com',
  password: 'password1',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
},{
  _id: userTwoId,
  email: 'alejandro1@gmail.com',
  password: 'password2',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}];

//carga 2 registros de /todos
const registros = [{
  _id: new ObjectID(),
  text: 'First test todo',
  _creator: userOneId
},{
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333,
  _creator: userTwoId
}];
//devuelve la base de datos cargada
const populateTodos = (done) => {
  Todos.remove({}).then(() => {
    return Todos.insertMany(registros);
  }).then(() => done ());
};

const populateUsers = (done) => {
  Users.remove({}).then(() => {
    var userOne = new Users(users[0]).save();
    var userTwo = new Users(users[1]).save();
    return Promise.all([userOne, userTwo]);
  }).then(() => done());
};

module.exports = {registros, populateTodos, users, populateUsers};
