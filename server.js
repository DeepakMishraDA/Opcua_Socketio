const http = require('http');
const { Server } = require("socket.io");

const alarmsOpc = require('./opcua/alarmApp');

const reqResFunc = (req,res) => {
    if(req.method = 'GET') {
        res.writeHead(200);
        res.end("All Ok!")
    }
}

const serv = http.createServer(reqResFunc);
const io = new Server(serv);

//server()
serv.listen(5000);
io.on('connection', (socket) => {
    console.log('a user connected');
    alarmsOpc(socket)

    socket.on('conn',data=>{
        console.log(data)})
  });