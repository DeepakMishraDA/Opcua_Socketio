var express = require('express');
var json = require('../providers/alarmdata.json');
const  users = require('../routers/alarmRoute');
// var { buildSchema } = require('graphql');
var router = express.Router();
const path = require('path')
const app = express();
const http = require('http')
const server = http.createServer(app);

// u can alternatively create a Server instance of socket.io
//const { Server } = require("socket.io");
//const io = new Server(server);
const io = require('socket.io')(server);
const alarmsOpc = require('../opcua/alarmApp');
require('dotenv').config();
app.set('port', process.env.PORT || 3000)
app.get('/',(req,res)=>{
    res.attachment(path.resolve('./dummy.txt'));  
    res.send();
       console.log(req.params);
    }
); 
app.use('/users',users)


io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('alarms', (data) => {
    console.log(`Received data: ${data}`);
    alarmsOpc(socket,data)
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});



const port = process.env.PORT;

server.listen(app.get('port'),() => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });


