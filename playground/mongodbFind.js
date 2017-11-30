const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) =>{
  if (err) {
    return console.log('Error connecting to mongoDB' + err);
  }
  console.log('Connected to Mongo DB!');
  var query = {
    name : 'Walter'
  };//5a2048b9a59db022403ba5ff
  // var query = {
  //   _id : new ObjectID('5a2048b9a59db022403ba5ff')
  // };

  // db.collection('Todos').find(query).toArray().then((docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // },(err) =>{
  //   console.log('Unable to fecth Todos Data base', err);
  // });

  // db.collection('Todos').find().count().then((count) => {
  //   console.log('Todos count: '+count);
  // },(err) =>{
  //   console.log('Unable to fecth Todos Data base', err);
  // });
// homework fetching all Users table with Walter name's
db.collection('Users').find(query).toArray().then((docs) => {
  console.log('Todos');
  console.log(JSON.stringify(docs, undefined, 2));
},(err) =>{
  console.log('Unable to fecth Todos Data base', err);
});


  // db.close();
});
