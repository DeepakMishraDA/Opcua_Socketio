const { io } = require("socket.io-client");
const assert = require('assert')

const client = io.connect('http://localhost:5000');
client.emit('conn',"Done!");
client.on('alarms',data =>{
    console.log("new:",data)
})
client.on('alarmsc',data =>{
    console.log("change:",data)
})
