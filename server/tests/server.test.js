const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todos} = require('./../models/todo');

const registros = [{
  text: 'First test todo'
}, {
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

describe('GET /Todos', () => {
  it('Should get all /todos', (done) =>{
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);

  });
});
