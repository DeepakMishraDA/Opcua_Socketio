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

  // let opcIp = buildingsList.find(element => element.id == data.buildingId)
            // const devOrProd = jwt_decode(socket.handshake.headers.cookie)
            // if((devOrProd.iss == 'https://dev.green-fusion.de/auth/realms/development') && 
            //   (opcIp.plc_ip == 'opc.tcp://10.0.42.1:4840')){
            //         opcIp = 'opc.tcp://10.0.42.2:4840'
            // }
            // console.log(":_)#))$",opcIp)


            //const jwt_decode = require('jwt-decode');