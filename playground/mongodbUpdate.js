const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) =>{
  if (err) {
    return console.log('Error connecting to mongoDB' + err);
  }
  console.log('Connected to Mongo DB!');

    //find one and Update
    db.collection('Users').findOneAndUpdate({
      _id: new ObjectID("5a205c8d19dccb19f0a9cc20") //busca el documento unico por id
    },{
      $set: {
        name: "Ale",
        completed: true //setea el cambio al campo q vamos a modificar
      },
      $inc: {
        age: 1
      }      
    },{
      //cuando es puesto en falso retorn el documento actualizado en vez
      //del original sin modificar
      returnOriginal: false
    }).then((result) => {
      console.log(result);
    });

  // db.close();
});
