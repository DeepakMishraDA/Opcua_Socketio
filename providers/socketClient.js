const { io } = require("socket.io-client");
var fs = require('fs'); 


const client = io.connect('http://localhost:5000');

//const data = 'opc.tcp://10.0.42.2:4840';
const data1 = 'opc.tcp://10.0.42.1:4840';
//const data2 = 'opc.tcp://10.6.3.1:4840'
//client.emit('conn',data)
client.emit('conn1',data1)

client.on('alarms',data =>{
        const fields = Object.keys(data)
        console.log('Saved!', fields)
});  
client.on('alarmsc',data =>{
   console.log("change:",data)
})
