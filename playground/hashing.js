const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var pass = 'abc123';
var encryp ='$2a$10$T8PHy6yv7IqR2fX9rF2sK.i56DsrWQf2Ql75MFxR7dEI2ejoIBsFO'
//genera el hash bcrypt
// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(pass, salt, (err, hash) => {
//     var encryp = hash;
//     console.log(encryp);
//   });
// });
//compara nuestro pass lo encripta y compara con el hash encrypt
bcrypt.compare(pass, encryp, (err, result) =>{
  console.log(result);
});


// var data = {
//   id: 10
// };
//
// var token = jwt.sign(data, '123abc');
// console.log(token);
//
//
// var decoded = jwt.verify(token, '123abc');
// console.log('decoded: ',decoded);



/*
var message = 'I am user number 3';
var hash = SHA256(message).toString();

console.log(`Mesagge: ${message}`);
console.log(`Hash: ${hash}`);

var data = {
  id: 4
};
var token = {
  data,
  hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
}

token.data.id = 5;
token.hash = SHA256(JSON.stringify(data)).toString();

var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

if(resultHash === token.hash) {
  console.log('data was not changed');
} else {
  console.log('Data was change. do not trust!');
}
*/
