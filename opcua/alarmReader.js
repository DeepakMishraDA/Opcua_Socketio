const opcua = require("node-opcua");
require('dotenv').config();

const client = opcua.OPCUAClient.create({
    endpointMustExist: false,
  });

const endpointUrl = process.env.EndpointUrl;

client.connect(endpointUrl, (err) => {
  if (err) {
    console.log("Error connecting to OPC UA server: ", err);
    return;
  }

  console.log("Connected to OPC UA server");

  const session = client.createSession();
  const tt = opcua.extractConditionFields(session);
  tt.then(data=>data)
  session.installAlarmReader((err, alarmReader) => {
    if (err) {
      console.log("Error installing alarm reader: ", err);
      return;
    }

    console.log("Alarm reader installed");

    // Now you can use the 'alarmReader' object to read alarms from the server

    // Don't forget to close the session and disconnect the client when you're done
    session.close((err) => {
      if (err) {
        console.log("Error closing session: ", err);
        return;
      }

      client.disconnect((err) => {
        if (err) {
          console.log("Error disconnecting from OPC UA server: ", err);
          return;
        }

        console.log("Disconnected from OPC UA server");
      });
    });
    alarmReader.on('newAlarm', async alarmValue => {
        //console.log(alarmValue)
          try {   
            //socket.emit('alarms',alarmValue)
            console.log(alarmValue)
          } catch (err) {
            console.log(err);
          }
        });
  });
});

