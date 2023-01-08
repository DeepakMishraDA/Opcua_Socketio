var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
var router = express.Router();
const path = require('path')
const app = express();
const http = require('http')
const server = http.createServer(app);

// u can alternatively create a Server instance of socket.io
//const { Server } = require("socket.io");
//const io = new Server(server);
const io = require('socket.io')(server);
const alarmsOpc = require('./opcua/alarmApp');
require('dotenv').config();

app.get('/',(req,res)=>{
    res.attachment(path.resolve('./dummy.txt'));  
    res.send();
       console.log(req.params);
    }
); 

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('alarms', (data) => {
    console.log(`Received data: ${data}`);
    alarmsOpc(socket)
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});



const port = process.env.Port;

server.listen(port,() => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });


