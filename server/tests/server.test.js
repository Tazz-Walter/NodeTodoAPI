const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todos} = require('./../models/todo');

const registros = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo'
}];

//esto borra todo de la base de datos(TodoApp) tabla "todos"
beforeEach((done) => {
  Todos.remove({}).then(() => {
    return Todos.insertMany(registros);
  }).then(() => done ());
});

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
describe('GET /Todos', () => {
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
//testeamdp Borrando datos a la base de datos
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
          // expect(null).toNotExist(); problema de q no funciona el metodo
          // todo = null
          expect(todo).toBe(null);
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
