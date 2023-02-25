const http = require('http');
const { Server } = require("socket.io");
//const { Client } = require('pg');
require('dotenv').config();

const alarmsOpc = require('./opcua/alarmApp');

// const client = new Client({
//     connectionString: process.env.DATABASE_URL
// });
// client.connect((err, client) => {
//     if(err){
//         console.log(err)
//     } else {
//         client.on('notification', (msg) => {
//             console.log("look here::::",msg.payload)
//         });
//         const query = client.query("Listen channel")
//     }
// })
const reqResFunc = (req,res) => {
    if(req.method = 'GET') {
        res.writeHead(200);
        res.end("All Ok!")
    }
}

const serv = http.createServer(reqResFunc);
const io = new Server(serv);
//serv.addListener()
//server()
serv.listen(5000);
io.on('connection',(socket) => {
    console.log('a user connected');
    socket.on('conn',data=>{
        console.log(data)
        alarmsOpc(socket,data)
        })
    socket.on('conn1',data=>{
        console.log(data)
        alarmsOpc(socket,data)
        })
    socket.on('conn2',data2=>{
        console.log(data2)
        alarmsOpc(socket,data2)
        })
  });
// var emitter = require('events').EventEmitter;

// var em = new emitter();
// var em1 = new emitter();

// //Subscribe FirstEvent
// em1.on('FirstEvent', function (data) {
//     console.log('First subscriber: ' + data);
// });

// //Subscribe SecondEvent
// em.on('SecondEvent', function (data) {
//     console.log('First subscriber: ' + data);
// });

// // Raising FirstEvent
// em1.emit('FirstEvent', 'This is my first Node.js event emitter example.');

// // Raising SecondEvent
// em.emit('SecondEvent', 'This is my second Node.js event emitter example.'); 

//   //model sensor {
//     building                               Int
//     name                                   String               @default("") @db.VarChar
//     node_id                                String               @id @db.VarChar
//     title_tag                              String               @default("") @db.VarChar
//     factor                                 Decimal              @default(1) @db.Decimal
//     periodic                               Boolean              @default(false)
//     writable                               Boolean              @default(false)
//     monthly                                Boolean              @default(false)
//     unit                                   String?              @db.VarChar
//     id                                     String               @db.Uuid
//     current_ts                             Int?
//     current_value                          String?              @db.VarChar
//     idn                                    Int                  
//    nodeIdToSensorNodeId                    alarms[]             @relation("nodeidInSensor")  
//   }
  
//   raisedTime  DateTime @default(now()) @db.Timestamptz(2)
//     alarmText String? @default(" ")@db.VarChar(1000)
//     severity Int?  @default(500)
//     relevant Boolean? 
//     archived Boolean?
//     alarms_nodeId_sensor sensor  @relation("nodeidInSensor", fields: [nodeId], references: [node_id],onDelete: Cascade, onUpdate: Cascade, map: "nodeId_fk")
//   //