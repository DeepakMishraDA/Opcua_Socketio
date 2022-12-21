const  { OPCUAClient } = require('node-opcua');
const alarmCaller = require('./alarmCaller');

  async function opcuaSession({ endpointUrl }) {
    const client = OPCUAClient.create({
      endpointMustExist: false,
    });
    if (endpointUrl) {
      await client.connect(endpointUrl);
    }
    console.log('connected to OpcServer now!');
    const session = await client.createSession();
    const subscription = await session.createSubscription2({
      requestedPublishingInterval: 200,
      requestedMaxKeepAliveCount: 20,
      maxNotificationsPerPublish: 1000,
      publishingEnabled: true,
      priority: 10,
    });

    return session;
  }

async function getAlarms(endpointUrl) {
  const reqSession = await opcuaSession({endpointUrl});
    await alarmCaller(reqSession);
    
    const alarmInstance = await alarmCaller(reqSession);
    return  alarmInstance;
  }

module.exports = getAlarms;
