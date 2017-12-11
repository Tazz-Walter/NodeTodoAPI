const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todos} = require('./../models/todo');
const {Users} = require('./../models/user');
const {registros, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
//llamam a populatesTodos borra todo de la base de datos(TodoApp) tabla "todos"
//y lo popula
beforeEach(populateTodos);

describe('POST /Todos', () => {
    it('should create a new Todo', (done) => {
      var text = 'Testeando /Todos';
      //crea un nuevo registro y lo testea
      request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
          expect(res.body.text).toBe(text);
        })
        .end((err,res) => {
          if (err) {
            return done(err);
          }
          //assumsions about database
          Todos.find({text}).then((todos) => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          }).catch((e) => done(e));
      });
    });
    //testea q no se creen objetos con datos invalidos
    it('Should not create todo with invalid body data', (done) =>{
      request(app)
        .post('/todos')
        .send()
        .expect(400)
        .end((err, res) =>{
          if(err) {
              return done(err);
          }

          Todos.find().then((todos) =>{
            expect(todos.length).toBe(2);
            done();
          }).catch((e) => done(e));
        });
    });
});
//testing Get todos los registros
describe('GET /Todos', () => {
  it('Should get all /todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);

  });
});
//testing get /todos con URL pasando ID
describe('GET /todos/:id', () => {
  it('Should return document from /todos/:id', (done) =>{
    request(app)
      .get(`/todos/${registros[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
          expect(res.body.todo.text).toBe(registros[0].text);
      })
      .end(done);
  });

  it('should return 404 todo not found', (done) => {
    var hexId = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get(`/todos/123abc`)
      .expect(404)
      .end(done);
  });
});
//testeando Borrando datos a la base de datos
describe('DELETE /todos/:id', () => {
  it('Should remove a todo', (done) => {
    var hexId = registros[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
          expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        //buscamos q realmente alla sido borrado
        Todos.findById(hexId).then((todo) => {
          expect(todo).toBeNull();
          done();
        }).catch((e)=> done(e));
      });
  });

  it('should retun 404 if object id is invalid', (done) => {
    var hexId = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', (done) => {
    request(app)
      .delete(`/todos/123abc`)
      .expect(404)
      .end(done);
  });

});
//Testing update - patch
describe('PATCH /todos/:id', () => {
  it('Should update the todo', (done) => {
    var hexId = registros[0]._id.toHexString();
    var text = 'this is de new text';

    request(app)
    .patch(`/todos/${hexId}`)
    .send({
      completed: true,
      text
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(true);
      expect(typeof(res.body.todo.completedAt)).toBe('number');
    })
    .end(done);
  });

  it('Should clear completedAt when todo is not completed', (done) => {
    var hexId = registros[1]._id.toHexString();
    var text = 'this is de new text2!!';

    request(app)
    .patch(`/todos/${hexId}`)
    .send({
      completed: false,
      text
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toBeNull();
    })
    .end(done);
  });
});
//testing Get users/me
describe('GET /users/me',() => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)//configura el header q se envia
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should not return user if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});
//testing /Post New Users
describe('POST /users',() => {
  it('should create New User', (done) => {
    var email = 'example@gmail.com';
    var password = '123abc';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.header['x-auth']).toBeDefined();
        expect(res.body._id).toBeDefined();
        expect(res.body.email).toEqual(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        Users.findOne({email}).then((user) => {
          expect(user).toBeDefined();
          expect(user.password).not.toEqual(password);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return validations error if request invalid', (done) => {
    var email = 'examplegmail.com';
    var password = '1c';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    var email = users[0].email;
    var password = '123abc';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });
});
//testing POST add new token for login Users
describe('POST /users/login',() => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.header['x-auth']).toBeDefined();
      })
      .end((err, res) =>{
        if (err) {
          return done(err);
        }
        Users.findById(users[1]._id).then((user) => {
          //buscamos el token q generamos arriba con el post en la posicion 0
          //ya que el usuario[1] no tiene tokens predefinidos
          expect(user.tokens[0]).toEqual(expect.objectContaining({
            access: 'auth',
            token: res.header['x-auth']
          }));
          done();
        }).catch((e) => done(e));
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: 'pasword0' // pasword erroneo
      })
      .expect(400)
      .expect((res) => {
        expect(res.header['x-auth']).not.toBeDefined();
      })
      .end((err, res) =>{
        if (err) {
          return done(err);
        }
        Users.findById(users[1]._id).then((user) => {
          expect(user.tokens.lenght).not.toBeDefined();
          done();
        }).catch((e) => done(e));
      });
  });

});
