const getAlarms = require('./getAlarms');
require('dotenv').config();

async function alarmsOpc(socket) { //{endpoint,socket}
    const alarmsInstance =  await getAlarms(process.env.EndpointUrl);
    console.log(alarmsInstance)
    socket.emit('alarms',alarmsInstance)
    alarmsInstance.on('newAlarm', async alarmValue => {
        try {   
          socket.emit('alarms',alarmValue)
        } catch (err) {
          console.log(err);
        }
      });
      alarmsInstance.on('alarmChanged', async alarmValue => {
        try {
         // socket.emit('alarmsc',alarmValue.fields.conditionId.value)
        } catch (err) {
          console.log(err);
        }
      })
}

module.exports = alarmsOpc;