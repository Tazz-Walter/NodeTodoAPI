const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todos} = require('./../models/todo');

//esto borra todo de la base de datos(TodoApp) tabla "todos"
beforeEach(('POST /Todos'), () => {
  Todos.remove({}).then(() => done());
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
        Todos.find().then((todos) => {
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
          expect(todos.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });


});
