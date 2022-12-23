const { io } = require("socket.io-client");
var fs = require('fs'); 


const client = io.connect('http://localhost:3000');
client.emit('conn',"Done!");
client.on('alarms',data =>{
    // fs.appendFile('alarmdata.js',JSON.stringify(data),function (err) {
    //     if (err) {throw err};
        console.log('Saved!', data)
   const RRR = Object.values(data).map(dataa => {
   return dataa
});
    console.log( RRR.length)
    let tt = []
    // for (const alarm of data) {
    // //console.log(alarm,"GAP!!!");
    // if (alarm.conditionId){
    // tt.push(alarm.conditionId.value.value);
    // }
    // }
    
})
client.on('alarmsc',data =>{
   // console.log("change:",data)
})
