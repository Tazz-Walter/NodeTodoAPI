const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) =>{
  if (err) {
    return console.log('Error connecting to mongoDB' + err);
  }
  console.log('Connected to Mongo DB!');
  var query = {
    // text : "waltereeee"
    complete: false
  };
  //Delete Many
  // db.collection('Todos').deleteMany(query).then((result) => {
  //   console.log(result);
  // });

  //DeleteOne
  // db.collection('Todos').deleteOne(query).then((result) => {
  //   console.log(result);
  // });
  //Find One and DeleteOne
  // db.collection('Todos').findOneAndDelete(query).then((result) => {
  //   console.log(result);
  // });
  // Eliminar 1 por id
  db.collection('Todos').findOneAndDelete({
    _id: new ObjectID('5a2048b9a59db022403ba5ff')
  }).then((result) => {
    console.log(result);
  });


  // db.close();
});
