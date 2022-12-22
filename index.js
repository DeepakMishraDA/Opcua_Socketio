var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
var router = express.Router();
const path = require('path')
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const alarmsOpc = require('./opcua/alarmApp');

app.get('/',(req,res)=>{
    res.attachment(path.resolve('./dummy.txt'));  
    res.send();
       console.log(req.params);
    }
); 

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.emit('alarms', (data) => {
    console.log(`Received data: ${data}`);
    alarmsOpc(socket)
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Listening on port 3000');
});

// Construct a schema, using GraphQL schema language
// var schema = buildSchema(`
//   type Query {
//     dell: String
//   }
// `);

// // The root provides a resolver function for each API endpoint
// var root = {
//   dell: () => {
//     return 'Hello world!';
//   },
// };





//app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');