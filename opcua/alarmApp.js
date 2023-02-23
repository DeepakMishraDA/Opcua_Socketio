const carryQuery = require('../database/carryQuery');
const {getAlarms} = require('./getAlarms');
require('dotenv').config();

async function alarmsOpc(socket,data) { //{endpoint,socket}
  console.log(data)
    const alarmsInstance =  await getAlarms(data);
    //console.log(alarmsInstance)
    alarmsInstance.on('newAlarm', async alarmValue => {   
      //console.log("?:",alarmValue)
      socket.emit('alarms',alarmValue.fields)
     // await carryQuery(alarmValue)
        try {   
         // await carryQuery({alarm:alarmValue})
          socket.emit('alarms',alarmValue)
        } catch (err) {
          console.log(err);
        }
      });
      alarmsInstance.on('alarmChanged', async alarmValue => {
     
        try {
          if (alarmValue){
        //  await carryQuery(alarmValue)
          }
          // socket.emit('alarmsc',alarmValue.fields.conditionId.value)
        } catch (err) {
          console.log(err);
        }
      })
}

module.exports = alarmsOpc;