const getAlarms = require('./getAlarms');
require('dotenv').config();

async function alarmsOpc(socket) { //{endpoint,socket}
    const alarmsInstance =  await getAlarms(process.env.EndpointUrl);
    alarmsInstance.on('newAlarm', async alarmValue => {
        try {   
          //console.log(alarmValue.fields.message);
          socket.emit('alarms',alarmValue.fields.conditionId.value)
        } catch (err) {
          console.log(err);
        }
      });
      alarmsInstance.on('alarmChanged', async alarmValue => {
        try {
          //console.log(alarmValue.fields.message);
          socket.emit('alarmsc',alarmValue.fields.conditionId.value)
        } catch (err) {
          console.log(err);
        }
      })
}

module.exports = alarmsOpc;